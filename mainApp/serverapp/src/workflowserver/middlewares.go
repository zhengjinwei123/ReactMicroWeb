package main

import (
	"net/http"
	l4g "serverapp/src/base/log4go"
	"serverapp/src/workflowserver/manager/eventmgr"
	"serverapp/src/workflowserver/manager/usermgr"
	"serverapp/src/workflowserver/net"
	"serverapp/src/workflowserver/session"
)

func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			resp := &net.NetResponse{}
			resp.Msg = "parse parameter error"
			resp.SendError(w)
			return
		}

		if false == session.UserHasLogin(w, r) {
			if r.URL.Path != "/api/user/login" &&
				r.URL.Path != "/api/user/logout" &&
				r.URL.Path != "/api/server_run_info" {
				resp := &net.NetResponse{}
				resp.Msg = "no auth, please login first"
				resp.SendErrorCode(w, net.ERROR_CODE_TOKEN_EXPIRED)
				return
			}
		}

		if r.URL.Path != "/api/user/login" &&
			r.URL.Path != "/api/user/logout" &&
			r.URL.Path != "/api/server_run_info" {
			userName := session.GetUserName(w, r)

			if usermgr.GetUserMgr().UserHasBanded(userName) {
				eventmgr.UserLogout(userName)

				resp := &net.NetResponse{}
				resp.Msg = "sorry, user has banded"
				resp.SendErrorCode(w, net.ERROR_CODE_BANED)
				return
			}
		}

		// 权限检查
		l4g.Debug("request: %s|%v", r.URL, r.Form)

		next.ServeHTTP(w, r)
	})
}