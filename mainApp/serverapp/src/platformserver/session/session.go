package session

import (
	"net/http"
	"serverapp/src/platformserver/config"
	"serverapp/src/platformserver/session/cookiesession"
	"serverapp/src/platformserver/session/redissession"
)

func UserHasLogin(w http.ResponseWriter, r *http.Request) bool {
	if config.GetServerConfig().IsEnableRedisSession() {
		return redissession.UserHasLogin(w, r)
	} else {
		return cookiesession.UserHasLogin(r)
	}
}

func SetUserLogin(username string, groupId int, w http.ResponseWriter, r *http.Request) error {
	if config.GetServerConfig().IsEnableRedisSession() {
		return redissession.SetUserLogin(username, groupId, w, r)
	} else {
		return cookiesession.SetUserLogin(username, groupId, w, r)
	}
}

func SetUserLogout(w http.ResponseWriter, r *http.Request) error {
	if config.GetServerConfig().IsEnableRedisSession() {
		return redissession.SetUserLogout(w, r)
	} else {
		return cookiesession.SetUserLogout(w, r)
	}
}

func GetUserName(w http.ResponseWriter, r *http.Request) string {

	if config.GetServerConfig().IsEnableRedisSession() {
		return redissession.GetUserName(w, r)
	} else {
		return cookiesession.GetUserName(r)
	}
}

func GetUserGroupId(w http.ResponseWriter, r *http.Request) int {
	if config.GetServerConfig().IsEnableRedisSession() {
		return redissession.GetUserGroupId(w, r)
	} else {
		return cookiesession.GetUserGroupId(r)
	}
}

func ClearAll() {
	if config.GetServerConfig().IsEnableRedisSession() {
		redissession.ClearAll()
	}
}