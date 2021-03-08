package net

import (
	"encoding/json"
	"io"
	"net/http"
	l4g "serverapp/src/base/log4go"
)

const (
	ERROR_CODE_BANED = 101
	ERROR_CODE_TOKEN_EXPIRED = 102
)

type response struct {
	Data interface{} `json:"data"`
	Ret int `json:"ret"`
}

func outputJson(data interface{}, ret int, w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Headers", "content-type,Authorization")
	w.Header().Add("Access-Control-Allow-Credentials", "true")
	w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
	w.WriteHeader(200)

	resp := &response{
		Data: data,
		Ret: ret,
	}

	retJson, err := json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = l4g.Error("response encode error: [%s] [%s]", err.Error())
		return
	}

	_, err = io.WriteString(w, string(retJson))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = l4g.Error("response error: [%s] [%s]", string(retJson), err.Error())
		return
	}

	if ret == -1 {
		_ = l4g.Error(string(retJson))
	}
}

type NetResponse struct {
	Msg interface{}
}

func (this *NetResponse) SendErrorCode(writer http.ResponseWriter, code int) {
	outputJson(this.Msg, code, writer)
}

func (this *NetResponse) SendError(writer http.ResponseWriter) {
	outputJson(this.Msg, -1, writer)
}

func (this *NetResponse) SendMessage(writer http.ResponseWriter) {
	outputJson(this.Msg, 0, writer)
}

func (this *NetResponse) SendSuccess(writer http.ResponseWriter) {
	outputJson("ok", 0, writer)
}