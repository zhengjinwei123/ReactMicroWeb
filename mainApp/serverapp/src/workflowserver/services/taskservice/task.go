package taskservice

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"serverapp/src/base/common"
	"serverapp/src/base/orm"
	"serverapp/src/workflowserver/config"
	"serverapp/src/workflowserver/dbservices/dbusertaskservice"
	"serverapp/src/workflowserver/proto/dbproto"
	"serverapp/src/workflowserver/proto/netproto"
	l4g "serverapp/src/base/log4go"
	"serverapp/src/workflowserver/dbservices/dbtaskservice"
	"serverapp/src/workflowserver/net"
	"serverapp/src/workflowserver/utils/idgenerator"
	"strconv"
	"strings"
)


func addTask(promoter string, taskId int64, taskName string, taskDesc string, priority int, relaters string, deadTime string, files string) error {

	deadTimeInt := common.DateFormatToUnix(deadTime, config.GetServerConfig().TimeZone).Unix()
	if err := dbtaskservice.AddTask(taskId, taskName, taskDesc, priority, promoter, relaters, deadTimeInt, files); err != nil {
		return err
	}

	relatersList := strings.Split(relaters, ",")
	for _, relater := range relatersList {
		if err := dbusertaskservice.AddUserTask(taskId, relater); err != nil {
			return err
		}
	}
	return nil
}

func isUploadDataValid(r *http.Request) bool {
	predictKeys := []string{"task_name", "task_desc", "priority", "relaters", "end_date"}

	for _, key := range predictKeys {
		if _, exists := r.MultipartForm.Value[key]; !exists {
			return false
		}
	}

	return true
}

func UpdateStatus(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetTaskUpdateRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}

	resp := &net.NetResponse{}

	l4g.Debug("%v %v", req.Status, req.TaskId)

	taskId64, err := strconv.ParseInt(req.TaskId, 10, 64)
	if err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	if err := dbusertaskservice.UpdateStatus(taskId64, req.Status); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}


func GetMyTaskList(w http.ResponseWriter, r *http.Request) {
	userName := r.Context().Value("username").(string)

	resp := &net.NetResponse{}

	var userTaskAll []*dbproto.DbUserTaskTableInfo
	if err := dbusertaskservice.GetUserTaskList(userName, &userTaskAll); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}
	userTaskAllMap := make(map[int64]*dbproto.DbUserTaskTableInfo, 0)
	taskIdList := make([]string, 0, len(userTaskAll))
	for _, v := range userTaskAll {
		taskIdList = append(taskIdList, fmt.Sprintf("%d", v.TaskId))

		userTaskAllMap[v.TaskId] = v
	}

	var taskAll []*dbproto.DbTaskTableInfo
	if err := dbtaskservice.GetTaskList(taskIdList, &taskAll); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	retList := make([]netproto.H, 0, len(taskAll))
	for _, v := range taskAll {
		retList = append(retList, netproto.H{
			"id": fmt.Sprintf("%d", v.TaskId),
			"taskName": v.TaskName,
			"taskDesc": v.TaskDesc,
			"promoter": v.Promoter,
			"acceptors": userTaskAllMap[v.TaskId].Acceptors,
			"relaters": v.Relaters,
			"dead_time": common.UnixStampToDateString(v.DeadTime, config.GetServerConfig().TimeZone),
			"start_time": common.UnixStampToDateString( userTaskAllMap[v.TaskId].Start_time, config.GetServerConfig().TimeZone),
			"finish_time": common.UnixStampToDateString( userTaskAllMap[v.TaskId].FinishTime, config.GetServerConfig().TimeZone),
			"accept_time": common.UnixStampToDateString( userTaskAllMap[v.TaskId].AcceptTime, config.GetServerConfig().TimeZone),
			"predict_cost_minute":  userTaskAllMap[v.TaskId].PredictCostMinute,
			"priority": v.Priority,
			"files": v.Files,
			"status":  userTaskAllMap[v.TaskId].Status,
			"modify_time":  userTaskAllMap[v.TaskId].ModifyTime,
			"create_time": v.CreateTime,
		})
	}

	resp.Msg = retList
	resp.SendMessage(w)
}


func TaskAdd(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseMultipartForm(32 << 20)

	resp := &net.NetResponse{}
	if isUploadDataValid(r) == false {
		resp.Msg = "data invalid"
		resp.SendError(w)
		return
	}

	taskId, _ := idgenerator.GetNextId()

	files := r.MultipartForm.File["files"]
	len := len(files)

	fileList := make([]string, 0, len)
	errStr := ""
	fileDir := "../upload"
	for i := 0; i< len; i++ {
		file, err := files[i].Open()
		defer file.Close()
		if err != nil {
			l4g.Error("open file err:%v", err)
			errStr = err.Error()
			break
		}

		if false == common.FileExists(fileDir) {
			common.CreateDir(fileDir)
		}
		if false == common.FileExists(fmt.Sprintf("%s/%d", fileDir, taskId)) {
			common.CreateDir(fmt.Sprintf("%s/%d", fileDir, taskId))
		}


		cur, err := os.Create(fmt.Sprintf("%s/%d/%s", fileDir, taskId, files[i].Filename))
		defer cur.Close()
		if err != nil {
			l4g.Error("create file err:%v", err)
			errStr = err.Error()
			break
		}
		io.Copy(cur, file)

		fileList  = append(fileList, files[i].Filename)
	}

	if errStr != "" {
		resp.Msg = errStr
		resp.SendError(w)
		return
	}

	userName := r.Context().Value("username").(string)

	taskName := r.MultipartForm.Value["task_name"][0]
	taskDesc := r.MultipartForm.Value["task_desc"][0]
	priority := r.MultipartForm.Value["priority"][0]
	relaters := r.MultipartForm.Value["relaters"][0]
	endDate := r.MultipartForm.Value["end_date"][0]

	priorityInt, err := strconv.Atoi(priority)
	if err != nil {
		resp.Msg = "invalid priority type, need a integer but not"
		resp.SendError(w)
		return
	}

	if err := addTask(userName,  taskId, taskName, taskDesc, priorityInt, relaters, endDate, strings.Join(fileList, ",")); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}