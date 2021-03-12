package main

import (
	"context"
	"crypto/md5"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"net/url"
	"serverapp/src/base/authorize"
	"serverapp/src/base/common"
	"serverapp/src/platformserver/config"
	"serverapp/src/platformserver/manager/eventmgr"
	"serverapp/src/platformserver/manager/usermgr"
	"serverapp/src/platformserver/net"
	"sort"
	"strings"
)

func IsSafeURL (r *http.Request) bool {
	url := r.URL.Path
	if url == "/api/user/login" || url == "/api/server_run_info" {
		return true
	}
	return false
}


func JwtAuthenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		err := r.ParseForm()
		if err != nil {
			resp := &net.NetResponse{}
			resp.Msg = "parse parameter error"
			resp.SendError(w)
			return
		}
		notNeedAuth := IsSafeURL(r)
		if notNeedAuth {
			next.ServeHTTP(w, r)
			return
		}
		resp := &net.NetResponse{}

		tokenHeader := r.Header.Get("Authorization")
		if tokenHeader == "" {
			resp.Msg = "missing auth token"
			resp.SendErrorCode(w, net.ERROR_CODE_TOKEN_EXPIRED)
			return
		}

		clain := &authorize.JWTClaims{}
		token, err := jwt.ParseWithClaims(tokenHeader, clain, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.GetServerConfig().Session.AuthTokenSecret), nil
		})

		if err != nil {
			resp.Msg = err.Error()
			resp.SendErrorCode(w, net.ERROR_CODE_TOKEN_EXPIRED)
			return
		}

		if !token.Valid {
			resp.Msg = "token is invalid"
			resp.SendErrorCode(w, net.ERROR_CODE_TOKEN_EXPIRED)
			return
		}

		if usermgr.GetUserMgr().UserHasBanded(clain.UserName) {
			eventmgr.UserLogout(clain.UserName)
			resp.Msg = "sorry, user has banded"
			resp.SendErrorCode(w, net.ERROR_CODE_BANED)
			return
		}

		now, _ := common.NowTimeIn(config.GetServerConfig().TimeZone)

		if now.Unix() > clain.ExpiresAt {
			resp.Msg = "token is expired"
			eventmgr.UserLogout(clain.UserName)
			resp.SendErrorCode(w, net.ERROR_CODE_TOKEN_EXPIRED)
			return
		}

		ctx := context.WithValue(r.Context(), "username", clain.UserName)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}


func sign(params url.Values) string {

	keys := make([]string, 0, len(params))

	for k, _ := range params {
		if k == "sign" {
			continue
		}
		keys = append(keys, k)
	}

	sort.Strings(keys)

	dataList := make([]string, 0, len(keys))
	for _, k := range keys {
		v := params[k]

		dataList = append(dataList, fmt.Sprintf("%s=%s", k, v))
	}

	ret := fmt.Sprintf("%s#%s", strings.Join(dataList, "#"), "123456")
	return fmt.Sprintf("%x", md5.Sum([]byte(ret)))
}

func AgentMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		err := r.ParseForm()
		resp := &net.NetResponse{}
		if err != nil {
			resp.Msg = "parse parameter error"
			resp.SendError(w)
			return
		}


		//l4g.Debug("agent: %v", r.Form)

		paramSign := r.FormValue("sign")
		mySign := sign(r.Form)

		if mySign != paramSign {
			resp.Msg = "sign error"
			resp.SendError(w)
			return
		}


		next.ServeHTTP(w, r)
	})
}