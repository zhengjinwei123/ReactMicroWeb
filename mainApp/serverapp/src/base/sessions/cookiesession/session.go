package cookiesession

import (
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"net/http"
)

const sessionKey = "session-key-xyz2raq"

var Store *sessions.CookieStore = nil

func Start() error {
	Store = sessions.NewCookieStore([]byte(securecookie.GenerateRandomKey(32)),
		[]byte(securecookie.GenerateRandomKey(32)),
		[]byte(securecookie.GenerateRandomKey(32)),
		[]byte(securecookie.GenerateRandomKey(32)),
	)

	Store.MaxAge(24 * 3600)
	return nil
}


func GetSession(name string, r *http.Request) interface{} {
	session, _ := Store.Get(r, sessionKey)

	if nameValue, ok := session.Values[name]; ok {
		return nameValue
	}

	return nil
}

func ClearSessions(w http.ResponseWriter, r *http.Request) error {
	session, _ := Store.Get(r, sessionKey)

	for key, _ := range session.Values {
		delete(session.Values, key)
	}
	return sessions.Save(r, w)
}

func SetUserLogin(username string, groupId int, w http.ResponseWriter, r *http.Request) error {
	session, _ := Store.Get(r, sessionKey)
	session.Values["username"] = username
	session.Values["groupid"] = groupId
	err := session.Save(r, w)

	return err
}

func SetUserLogout(w http.ResponseWriter, r *http.Request) error {
	//userName := GetSession("username", r)

	return ClearSessions(w, r)
}

func GetUserName(r *http.Request) string {
	userName := GetSession("username", r)

	if userName == nil {
		return ""
	}

	return userName.(string)
}

func GetUserGroupId(r *http.Request) int {
	groupId := GetSession("groupid", r)

	if groupId == nil {
		return 0
	}

	return groupId.(int)
}


func UserHasLogin(r *http.Request) bool {
	userName := GetUserName(r)
	if userName == "" {
		return false
	}
	return true
}