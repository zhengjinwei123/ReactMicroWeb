package redissession

import (
	"errors"
	"fmt"
	"strconv"

	"net/http"
	//"github.com/dxvgef/tsing"
	"serverapp/src/base/sessions"
	"time"
)

var sessEngine *sessions.Engine

func Start(idleTime int, maxAge int, redisAddr string, redisdb int, password string, keyPrefix string) error {
	var err error

	//var idleTimeInt int = config.GetServerConfig().Session.IdleTime

	//if idleTimeInt < 60 {
	//	idleTimeInt = 60;
	//}
	//l4g.Debug("idle: %d", idleTimeInt)


	// 创建session引擎
	sessEngine, err = sessions.NewEngine(sessions.Config{
		CookieName:                 "sessionid",        // cookie中的sessionID名称
		HttpOnly:                   true,               // 仅允许HTTP读取，js无法读取
		Domain:                     "",                 // 作用域名，留空则自动获取当前域名
		Path:                       "/",                // 作用路径
		MaxAge:                     maxAge,            // 最大生命周期（秒）
		IdleTime:                   time.Duration(idleTime) * time.Minute,   // 空闲超时时间
		Secure:                     false,              // 启用HTTPS
		DisableAutoUpdateIdleTime:  false,              // 禁止自动更新空闲时间
		RedisAddr:                  redisAddr,
		RedisDB:                    redisdb,                  // Redis数据库
		RedisPassword:              password,                 // Redis密码
		RedisKeyPrefix:             keyPrefix,             // Redis中的键名前缀，必须
		Key:                        "session_key_byvr", // 用于加密sessionID的密钥，密钥的长度16,24,32对应AES-128,AES-192,AES-256算法
	})
	if err != nil {
		return err
	}
	return nil
}

func get(name string, w http.ResponseWriter, r *http.Request) (string, error) {
	session, err := sessEngine.Use(r, w)
	if err != nil {
		return "",  err
	}
	value := session.Get(name)
	if value == nil {
		return "", errors.New("get session failed")
	}
	if value.Error != nil {
		return "", value.Error
	}

	return value.String()
}

func set(key, value string, w http.ResponseWriter, r *http.Request) error {
	session, err := sessEngine.Use(r, w)
	if err != nil {
		return err
	}

	return session.Set(key, value)
}

func remove(name string, w http.ResponseWriter, r *http.Request) error {
	session, err := sessEngine.Use(r, w)
	if err != nil {
		return err
	}
	return session.Delete(name)
}

func clear(w http.ResponseWriter, r *http.Request) error {
	session, err := sessEngine.Use(r, w)
	if err != nil {
		return err
	}
	return session.ClearData()
}

func ClearAll() {
	sessEngine.FlushDb()
}

func GetUserName(w http.ResponseWriter, r *http.Request) string {
	username, err := get("username", w, r)
	if err != nil {
		return ""
	}
	return username
}

func GetUserGroupId(w http.ResponseWriter, r *http.Request) int {
	groupIdStr, err := get("groupid", w, r)
	if err != nil {
		return 0
	}

	groupId, err := strconv.Atoi(groupIdStr)
	if err != nil {
		return 0
	}
	return groupId
}


func SetUserLogin(username string, groupId int, w http.ResponseWriter, r *http.Request) error {
	if err := set("username", username, w, r); err != nil {
		return err
	}
	if err := set("groupid", fmt.Sprintf("%d", groupId), w, r); err != nil {
		return err
	}

	return nil
}

func SetUserLogout(w http.ResponseWriter, r *http.Request) error {
	return clear(w, r)
}

func UserHasLogin(w http.ResponseWriter, r *http.Request) bool {
	username := GetUserName(w, r)
	return username != ""
}