package authorize

import (
	"github.com/dgrijalva/jwt-go"
	"time"
)

type JWTClaims struct {
	UserName string
	jwt.StandardClaims
}

func CreateJwtToken(username string, secret string, now time.Time, expireTime int64) (string) {
	c := &JWTClaims {UserName: username}
	c.SetExpireAt(now.Add(time.Second * time.Duration(expireTime)).Unix())
	c.IssuedAt = now.Unix()

	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), c)
	tokenString, _ := token.SignedString([]byte(secret))
	return tokenString
}

func (this *JWTClaims) SetExpireAt(expiredAt int64) {
	this.ExpiresAt = expiredAt
}

func (this *JWTClaims) Refresh(now time.Time, expireTime int64) {
	this.ExpiresAt = now.Unix() + (this.ExpiresAt - this.IssuedAt)
}

