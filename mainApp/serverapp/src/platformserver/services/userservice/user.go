package userservice

import (
	"net/http"
	"serverapp/src/base/authorize"
	"serverapp/src/base/common"
	l4g "serverapp/src/base/log4go"
	"serverapp/src/base/orm"
	"serverapp/src/platformserver/config"
	"serverapp/src/platformserver/dbservice/dbgroupservice"
	"serverapp/src/platformserver/dbservice/dbuserservice"
	"serverapp/src/platformserver/manager/eventmgr"
	"serverapp/src/platformserver/manager/menumgr"
	"serverapp/src/platformserver/manager/usermgr"
	"serverapp/src/platformserver/net"
	"serverapp/src/platformserver/proto/dbproto"
	"serverapp/src/platformserver/proto/netproto"
)

func Login(w http.ResponseWriter, r *http.Request) {

	req := &netproto.NetUserLoginRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n",r.PostForm, err)
		return
	}

	resp := &net.NetResponse{}

	userInfo := &dbproto.DbUserTableInfo{}
	if err := dbuserservice.GetUser(req.UserName, userInfo); err != nil {
		resp.Msg = "username not exists"
		resp.SendError(w)
		return
	}

	if userInfo.Password != req.Password {
		resp.Msg = "password error"
		resp.SendError(w)
		return
	}

	if userInfo.Status != 0 {
		resp.Msg = "user has banbed"
		resp.SendError(w)
		return
	}

	servConfig := config.GetServerConfig()
	now, _ := common.NowTimeIn(servConfig.TimeZone)

	token := authorize.CreateJwtToken(userInfo.UserName,
		servConfig.Session.AuthTokenSecret, now, int64(servConfig.Session.MaxAge))

	resp.Msg = netproto.H{
		"token": token,
		"nickname": userInfo.NickName,
		"webname": config.GetServerConfig().WebName,
		"timezone": config.GetServerConfig().TimeZone,
		"menus":  menumgr.GetMenuMgr().GetMenusByGroupId(userInfo.GroupId),
	}

	eventmgr.UserLogin(userInfo)

	resp.SendMessage(w)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	resp := &net.NetResponse{}
	userName := r.Context().Value("username")
	if userName == nil {
		resp.SendSuccess(w)
		return
	}
	eventmgr.UserLogout(userName.(string))

	resp.SendSuccess(w)
}

func Register(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetUserRegisterRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}
	resp := &net.NetResponse{}

	userInfo := &dbproto.DbUserTableInfo{}
	if err := dbuserservice.GetUser(req.UserName, userInfo); err == nil {
		resp.Msg = "username has exists"
		resp.SendError(w)
		return
	}


	if err := dbuserservice.AddUser(req.UserName, req.Password, req.Email, req.GroupId, req.NickName); err != nil {
		resp.Msg = err.Error() + "| 请检查邮箱是否已经被使用!"
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}

func Delete(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetUserDelRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}
	resp := &net.NetResponse{}

	if err := dbuserservice.DelUser(req.UserName); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}

func AllMenus(w http.ResponseWriter, r *http.Request) {
	menus := menumgr.GetMenuMgr().GetMenusByGroupId(1)

	resp := &net.NetResponse{}
	resp.Msg = menus
	resp.SendMessage(w)
}

func GetUserInfo(w http.ResponseWriter, r *http.Request) {

	userName := r.Context().Value("username").(string)

	groupId := usermgr.GetUserMgr().GetGroupId(userName)

	resp := &net.NetResponse{}
	resp.Msg = netproto.H{
		"webname": config.GetServerConfig().WebName,
		"timezone": config.GetServerConfig().TimeZone,
		"menus":  menumgr.GetMenuMgr().GetMenusByGroupId(groupId),
	}
	resp.SendMessage(w)
}

func AllUsers(w http.ResponseWriter, r *http.Request) {

	var userAll []*dbproto.DbUserTableInfo
	resp := &net.NetResponse{}
	if err := dbuserservice.GetAllUsers(&userAll); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	var groupAll []*dbproto.DbGroupTableInfo
	if err := dbgroupservice.GetAll(&groupAll); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	groupIdMap := make(map[int]string, 0)
	for _, value := range groupAll {
		groupIdMap[value.GroupId] = value.Desc
	}


	retList := make([]netproto.H, 0, len(userAll))

	for _, v := range userAll {
		if groupName, ok := groupIdMap[v.GroupId]; ok {
			retList = append(retList, netproto.H{
				"user_name": v.UserName,
				"group_id": v.GroupId,
				"group_name": groupName,
				"email": v.Email,
				"nickname": v.NickName,
				"status": v.Status,
			})
		}
	}

	resp.Msg = retList
	resp.SendMessage(w)
}

func UserBan(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetUserBanRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}

	var status int = 0
	if req.Status == 0 {
		status = 1
	}

	resp := &net.NetResponse{}
	if err := dbuserservice.UpdateStatus(req.UserName, status); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	usermgr.GetUserMgr().BanUser(req.UserName, status)

	resp.SendSuccess(w)
}

func UpdateEmailAndGroup(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetUpdateEmailAndGroupRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}

	resp := &net.NetResponse{}
	if err := dbuserservice.UpdateEmailAndGroup(req.UserName, req.Email, req.GroupId, req.NickName); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}

func UpdatePassword(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetUserUpdatePasswordRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}

	resp := &net.NetResponse{}
	if err := dbuserservice.UpdatePassword(req.UserName, req.Password); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}