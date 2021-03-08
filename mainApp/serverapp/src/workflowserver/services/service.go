package services

import (
	"net/http"
	"serverapp/src/workflowserver/net"
)

func UserInfo(w http.ResponseWriter, r *http.Request) {
	resp := &net.NetResponse{}

	resp.Msg = "OK"
	resp.SendMessage(w)
}