package eventmgr

import (
	"serverapp/src/platformserver/manager/usermgr"
	"serverapp/src/platformserver/proto/dbproto"
)

func UserLogin(userInfo *dbproto.DbUserTableInfo) {
	usermgr.GetUserMgr().Login(userInfo.UserName, userInfo.Status, userInfo.GroupId)
}

func UserLogout(username string) {
	usermgr.GetUserMgr().Logout(username)
}

func ServerShutdown() {
	usermgr.GetUserMgr().Clear()
}