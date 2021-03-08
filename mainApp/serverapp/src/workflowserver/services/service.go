package services

import (
	"net/http"
	"serverapp/src/workflowserver/net"
)

func GetUserName(r *http.Request) string {
	userName := r.Context().Value("username")
	if userName != nil {
		return userName.(string)
	}
	return ""
}

func UserInfo(w http.ResponseWriter, r *http.Request) {
	resp := &net.NetResponse{}

	userName := GetUserName(r)

	resp.Msg = "get userinfo ok, userName:" + userName
	resp.SendMessage(w)
}