package common

import (
	"crypto/md5"
	"encoding/hex"
)

var (
	md5Hash = md5.New()
)

func Md5(str string) string {
	md5Hash.Reset()
	md5Hash.Write([]byte(str))
	return hex.EncodeToString(md5Hash.Sum(nil))
}