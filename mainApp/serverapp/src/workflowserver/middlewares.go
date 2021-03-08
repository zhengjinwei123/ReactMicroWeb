package main

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"serverapp/src/base/authorize"
	"serverapp/src/base/common"
	"serverapp/src/workflowserver/net"
	"serverapp/src/workflowserver/config"
	//l4g "serverapp/src/base/log4go"
)

func JwtAuthenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		err := r.ParseForm()
		if err != nil {
			resp := &net.NetResponse{}
			resp.Msg = "parse parameter error"
			resp.SendError(w)
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


		now, _ := common.NowTimeIn(config.GetServerConfig().TimeZone)

		if now.Unix() > clain.ExpiresAt {
			resp.Msg = "token is expired"
			resp.SendErrorCode(w, net.ERROR_CODE_TOKEN_EXPIRED)
			return
		}

		ctx := context.WithValue(r.Context(), "username", clain.UserName)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}