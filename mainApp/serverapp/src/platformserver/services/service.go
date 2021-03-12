package services

import (
	"net/http"
	"serverapp/src/platformserver/config"
	"serverapp/src/platformserver/dbservice/dbuserservice"
	"serverapp/src/platformserver/net"
	"serverapp/src/platformserver/proto/dbproto"
	"serverapp/src/platformserver/proto/netproto"
	//l4g "serverapp/src/base/log4go"
)

func ServerRunInformation(w http.ResponseWriter, r *http.Request) {

	resp := &net.NetResponse{}

	// 获取子应用配置
	retList := make([]netproto.H, 0, len(config.GetServerConfig().ChildApps.Apps))
	for _, v := range config.GetServerConfig().ChildApps.Apps {
		retList = append(retList, netproto.H{
			"name": v.Name,
			"host": v.Host,
		})
	}

	// 获取语言包
	resp.Msg = netproto.H{
		"apps": retList,
		"lan": config.GetServerConfig().Language,
	}
	resp.SendMessage(w)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {

	var userAll []*dbproto.DbUserTableInfo
	resp := &net.NetResponse{}

	if err := dbuserservice.GetAllUsers(&userAll); err != nil {
		resp.Msg = err.Error()
		resp.SendError(w)
		return
	}

	retList := make([]netproto.H, 0, len(userAll))
	for _, v := range userAll {

		if v.Status != 0 {
			continue
		}
		retList = append(retList, netproto.H{
			"username": v.UserName,
			"nickname": v.NickName,
			"email": v.Email,
		})
	}

	resp.Msg = retList
	resp.SendMessage(w)
}

func Test(w http.ResponseWriter, r *http.Request) {
	resp := &net.NetResponse{}

	resp.Msg = "Test success zjw"
	resp.SendMessage(w)
}