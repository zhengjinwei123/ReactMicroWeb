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

type xmlMysql struct {
	Host string `xml:"host"`
	Port int `xml:"port"`
	Database string `xml:"database"`
	UserName string `xml:"username"`
	Password string `xml:"password"`
}

type xmlRedis struct {
	Host string `xml:"host"`
	Port int `xml:"port"`
	Database int `xml:"db"`
	Password string `xml:"password"`
}

type xmlSession struct {
	Typ string `xml:"type"`
	MaxAge int `xml:"maxAge"`
	IdleTime int `xml:"idleTime"`
	KeyPrefix string `xml:"keyPrefix"`
	Redis xmlRedis `xml:"redis"`
}

type xmlApp struct {
	Name string `xml:"name,attr"`
	Host string `xml:"host,attr"`
}

type xmlChildApps struct {
	Apps []xmlApp `xml:"app"`
}

type serverConfig struct {
	Http           string   `xml:"http"`
	Log            xmlLog   `xml:"log"`
	Mysql          xmlMysql `xml:"mysql"`
	Session        xmlSession `xml:"session"`
	TimeZone       string `xml:"time-zone"`
	WebName        string `xml:"web-name"`
	ChildApps      xmlChildApps `xml:"childapps"`
	Language       string `xml:"language"`
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

func (this *serverConfig) GetRedisAddr() string {
	return fmt.Sprintf("%s:%d", this.Session.Redis.Host, this.Session.Redis.Port)
}

func (this *serverConfig) IsEnableRedisSession() bool {
	return this.Session.Typ == "redis"
}

func LoadServerConfig() error {
	if err := common.LoadConfig(*configFile, g_serverConfig); err != nil {
		return errors.New(fmt.Sprintf("load server config %v failed: %v", *configFile, err))
	}
	return nil
}
