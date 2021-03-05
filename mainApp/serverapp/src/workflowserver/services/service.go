package services

import (
	"net/http"
	"serverapp/src/workflowserver/config"
	"serverapp/src/workflowserver/net"
	"serverapp/src/workflowserver/proto/netproto"
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