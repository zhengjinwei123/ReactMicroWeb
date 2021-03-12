package config

import (
	"errors"
	"flag"
	"fmt"
	"serverapp/src/base/common"
)

var (
	g_serverConfig = newServerConfig()
	configFile = flag.String("config", "../settings/config.xml", "")
)


type xmlLog struct {
	Config string `xml:"config"`
}

type xmlSession struct {
	AuthTokenSecret string `xml:"auth-token-secret"`
}

type xmlMysql struct {
	Host string `xml:"host"`
	Port int `xml:"port"`
	Database string `xml:"database"`
	UserName string `xml:"username"`
	Password string `xml:"password"`
}

type xmlPlatformServer struct {
	Addr string `xml:"addr"`
	SecretKey string `xml:"secret-key"`
}

type serverConfig struct {
	Http           string   `xml:"http"`
	Log            xmlLog   `xml:"log"`
	Mysql          xmlMysql `xml:"mysql"`
	Session        xmlSession `xml:"session"`
	TimeZone       string `xml:"time-zone"`
	PlatformServer xmlPlatformServer `xml:"platform-server"`
}

func newServerConfig() *serverConfig {
	return &serverConfig{}
}

func GetServerConfig() *serverConfig {
	return g_serverConfig
}

func (this *serverConfig) GetMysqlAddr() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", this.Mysql.UserName,
		this.Mysql.Password, this.Mysql.Host, this.Mysql.Port, this.Mysql.Database)
}

func LoadServerConfig() error {
	if err := common.LoadConfig(*configFile, g_serverConfig); err != nil {
		return errors.New(fmt.Sprintf("load server config %v failed: %v", *configFile, err))
	}
	return nil
}