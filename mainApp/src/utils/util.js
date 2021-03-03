import axios from "axios"
import Qs from "qs"
import { showLoading, hideLoading } from "../components/PageLoading"
import _ from "lodash"
import {message } from "antd"


const headerConfig = {
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
}
const postApi= (path, params, callback) => {
    showLoading()

    axios.post(path, Qs.stringify(params), headerConfig).then( (resp) => {
        hideLoading()

        if (resp.status !== 200) {
            console.error("request " + path, params, " response:", resp)
            callback("request failed")
        } else {
            console.log(path, params, resp)

            if (!resp.data) {
                callback("resp data invalid")
            } else {
                if (resp.data.ret == -1) {
                    console.error(resp.data.data)

                    callback(resp.data.data) 
                } else if (resp.data.ret == 101) {
                    message.error("账号已封禁，请联系管理员")
                } else if (resp.data.ret == 102) {
                    message.error("TOKEN 已过期，请点击下线重新登录")
                } else {
                    callback(null, resp.data.data) 
                }
            }
        }
    }).catch ( err => {
        hideLoading()

        console.error("request " + path, params, " catch error:", err)
        callback(_.isString(err) ? err : JSON.stringify(err))
    })
}

const setStorage = (key, value) => {
    const dataType = typeof value
    if (dataType === "object") {
        window.localStorage.setItem(key, JSON.stringify(value))
    } else if (["number", "string", "boolean"].indexOf(dataType) >= 0) {
        window.localStorage.setItem(key, value)
    } else {
        window.alert(`setStorage error, dataType=${dataType}, 该类型不能用于本地存储`)
    }
}

const getStorage = (key) => {
    let data = window.localStorage.getItem(key);
    if (data) {
        let rawData = '';
        let error = null;
        try {
            rawData = JSON.parse(data);
        } catch (e) {
            error = e;
        }
        if (error) {
            return data;
        }
        return rawData;
    }
    return '';
}

const clearStorage = () => {
    window.localStorage.clear();
}

const removeStorage = (key) => {
    window.localStorage.removeItem(key);
}

const redirectLogin = () => {
    window.location.href="/login?redirect=" + encodeURIComponent(window.location.pathname)
}

const redirectTo = (url) => {
    window.open(url, "top")
}

export {
    postApi,
    setStorage,
    getStorage,
    removeStorage,
    redirectLogin,
    redirectTo
}