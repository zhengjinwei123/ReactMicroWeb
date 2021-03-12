package services

import (
	"net/http"
	"serverapp/src/workflowserver/net"
	"serverapp/src/workflowserver/agent/platformagent"
)


func GetUserName(r *http.Request) string {
	userName := r.Context().Value("username")
	if userName != nil {
		return userName.(string)
	}
	return ""
}


func GetUsers(w http.ResponseWriter, r *http.Request) {
	resp := &net.NetResponse{}

	ret, err := platformagent.GetUserList()
	if err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.Msg = string(ret)

	resp.SendMessage(w)
}