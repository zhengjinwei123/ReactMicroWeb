package groupservice

import (
	"net/http"
	"serverapp/src/base/orm"
	"serverapp/src/platformserver/dbservice/dbgroupservice"
	"serverapp/src/platformserver/manager/menumgr"
	"serverapp/src/platformserver/net"
	"serverapp/src/platformserver/proto/dbproto"
	"serverapp/src/platformserver/proto/netproto"
	l4g "serverapp/src/base/log4go"
)

func Add(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetGroupAddRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}
	resp := &net.NetResponse{}
	if err := dbgroupservice.AddGroup(req.GroupName, req.Menus, ""); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}
	var groupModel dbproto.DbGroupTableInfo
	if err := dbgroupservice.GetGroupByName(req.GroupName, &groupModel); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	if err := menumgr.GetMenuMgr().LoadMenuByGroupId(groupModel.GroupId, groupModel.MenuStr); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}

func Delete(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetGroupDeleteRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}
	resp := &net.NetResponse{}

	if req.GroupId == 1 {
		resp.Msg = "NO AUTH"
		resp.SendError(w)
		return
	}

	if err := dbgroupservice.DeleteGroup(req.GroupId); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}

func AllGroups(w http.ResponseWriter, r *http.Request) {

	var groupAll []*dbproto.DbGroupTableInfo

	resp := &net.NetResponse{}
	if err := dbgroupservice.GetAll(&groupAll); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	retList := make([]netproto.H, 0, len(groupAll))


	for _, v := range groupAll {
		retList = append(retList, netproto.H{
			"group_id": v.GroupId,
			"group_name": v.Desc,
			"menus": menumgr.GetMenuMgr().GetMenusByGroupId(v.GroupId),
			"auths": v.AuthStr,
		})
	}

	resp.Msg = retList
	resp.SendMessage(w)
}

func UpdateMenus(w http.ResponseWriter, r *http.Request) {
	req := &netproto.NetGroupUpdateMenuRequest{}
	err := orm.UnmarshalHttpValues(req, r.PostForm)

	if err != nil {
		_ = l4g.Error("UnmarshalHttpValues error: [%v] %v \n", r.PostForm, err)
		return
	}
	resp := &net.NetResponse{}

	if req.GroupId == 1 {
		resp.Msg = "NO AUTH"
		resp.SendError(w)
		return
	}

	if err := dbgroupservice.UpdateMenu(req.GroupId, req.Menus); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	if err := menumgr.GetMenuMgr().LoadMenuByGroupId(req.GroupId, req.Menus); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	resp.SendSuccess(w)
}