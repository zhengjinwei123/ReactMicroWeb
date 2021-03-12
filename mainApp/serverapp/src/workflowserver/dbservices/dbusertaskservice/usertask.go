package dbusertaskservice

import (
	"errors"
	"fmt"
	"serverapp/src/base/common"
	"serverapp/src/workflowserver/config"
	"serverapp/src/workflowserver/proto/dbproto"
	"serverapp/src/workflowserver/sql"
)

const table_name = "t_user_task"


func AddUserTask(taskId int64, userName string) error {
	proxy := sql.GetMysqlProxy()

	dateTime := common.GetNowDateString(config.GetServerConfig().TimeZone)
	err := proxy.Insert(fmt.Sprintf("insert into `%s` (`user_name`,`task_id`,`create_time`,`modify_time`) values(" +
		"'%s', '%d', '%s', '%s')", table_name, userName, taskId, dateTime, dateTime))
	return err
}

func UpdateStatus(taskId int64, status int) error {
	proxy := sql.GetMysqlProxy()

	err, updated := proxy.Update(fmt.Sprintf("update `%s` set `status`=%d where `task_id`=%d", table_name, status, taskId))
	if err != nil {
		return err
	}
	if updated <= 0 {
		return errors.New("data not changed")
	}
	return nil
}

func GetUserTaskList(userName string, vList* []*dbproto.DbUserTaskTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryList(fmt.Sprintf("select * from %s",
		table_name), vList)
	if err != nil {
		return err
	}
	return nil
}

