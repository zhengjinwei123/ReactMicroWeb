package eventmgr

import (
	"serverapp/src/workflowserver/manager/usermgr"
	"serverapp/src/workflowserver/proto/dbproto"
	"serverapp/src/workflowserver/session"
)

func UserLogin(userInfo *dbproto.DbUserTableInfo) {
	usermgr.GetUserMgr().Login(userInfo.UserName, userInfo.Status)
}

func UserLogout(username string) {
	usermgr.GetUserMgr().Logout(username)
}

func ServerShutdown() {
	usermgr.GetUserMgr().Clear()
	session.ClearAll()
}