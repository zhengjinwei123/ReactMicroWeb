package dbtaskservice

import (
	"errors"
	"fmt"
	"serverapp/src/base/common"
	"serverapp/src/workflowserver/proto/dbproto"
	"serverapp/src/workflowserver/sql"
	"serverapp/src/workflowserver/config"
	"strings"
)

const table_name = "t_task"


func AddTask(taskId int64, taskName, taskDesc string, priority int, promoter, relaters string, deadTime int64, files string) error {
	proxy := sql.GetMysqlProxy()

	cnt, err := proxy.GetCount(fmt.Sprintf("select `task_id` from `%s` where `task_name`='%s'", table_name, taskName))
	if err != nil {
		return err
	}

	if cnt > 0 {
		return errors.New(fmt.Sprintf("task %s has exists, please try replace other task name", taskName))
	}

	dateTime := common.GetNowDateString(config.GetServerConfig().TimeZone)

	err = proxy.Insert(fmt.Sprintf("insert into `%s` (`task_id`, `task_name`,`task_desc`, `priority`, `promoter`," +
		"`relaters`,`dead_time`,`files`, `modify_time`, `create_time`) values(" +
		"%d, '%s', '%s', %d, '%s', " +
		"'%s', '%s', '%s', '%s', '%s')", table_name, taskId, taskName, taskDesc, priority, promoter,
		relaters, deadTime, files, dateTime, dateTime))

	return err
}

func GetTask(taskName string, taskInfo *dbproto.DbTaskTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryOne(fmt.Sprintf("select * from %s where `task_name`='%s'",
		table_name, taskName), taskInfo)
	if err != nil {
		return err
	}
	return nil
}

func GetTaskById(taskId int, taskInfo *dbproto.DbTaskTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryOne(fmt.Sprintf("select * from %s where `id`='%d'",
		table_name, taskId), taskInfo)
	if err != nil {
		return err
	}
	return nil
}

func GetTaskList(taskIdList []string, vList* []*dbproto.DbTaskTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryList(fmt.Sprintf("select * from %s where `task_id` in(%s)",
		table_name, strings.Join(taskIdList, ",")), vList)
	if err != nil {
		return err
	}
	return nil
}