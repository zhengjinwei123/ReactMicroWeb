package config

import (
	"serverapp/src/base/common"
	"errors"
	"flag"
	"fmt"
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
	KeyPrefix string `xml:"keyPrefix"`
	Redis xmlRedis `xml:"redis"`
}

type serverConfig struct {
	Http           string   `xml:"http"`
	Log            xmlLog   `xml:"log"`
	Mysql          xmlMysql `xml:"mysql"`
	Session        xmlSession `xml:"session"`
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
