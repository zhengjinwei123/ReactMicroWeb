package lanmgr

import (
	"errors"
	"flag"
	"fmt"
	"serverapp/src/base/common"
)

type lanMgr struct {
	LanMessage string
}

var localefileDir = flag.String("localedir", "../settings/locale", "")
var g_lanMgr *lanMgr = nil

func (this *lanMgr) Load(lan string) error {
	filePath := fmt.Sprintf("%s/%s", *localefileDir, lan + ".json")
	if false == common.FileExists(filePath) {
		return errors.New("language: " + lan + " packet not exists")
	}

	content, err := common.FileGetContent(filePath)
	if err != nil {
		return err
	}

	this.LanMessage = content

	return nil
}

func GetLanMgr() *lanMgr {
	if g_lanMgr == nil {
		g_lanMgr = &lanMgr{}
	}
	return g_lanMgr
}