import {postApi, setStorage, removeStorage, getStorage } from "../utils/util"
import _ from "lodash"


const login = (loginInfo, callback) => {
    postApi("/api/user/login", loginInfo, (err, data) => {
        callback(err, data)
    })
}

const logout = (callback) => {
    postApi("/api/user/logout", {}, (err, data) => {
        callback(err, data)
    })
}

const register = (userinfo, callback) => {
    postApi("/api/user/register", userinfo, (err, data) => {
        callback(err, data)
    })
}

const GetAllMenus = (callback) => {
    postApi("/api/user/all_menus", {}, (err, data) => {
        callback(err, data)
    })
}

const GetUserList = (callback) => {
    postApi("/api/user/list", {}, (err, data) => {
        callback(err, data)
    })
}

const GetLoginUserInfo = (callback) => {
    postApi("/api/user/user_info", {}, (err, data) => {
        callback(err, data)
    })
}

const BanUser = (username, status, callback) => {
    postApi("/api/user/ban", {username, status}, (err, data) => {
        callback(err, data)
    })
}

const UpdatePassword = (username, password, callback) => {
    postApi("/api/user/update_password", {username, password}, (err, data) => {
        callback(err, data)
    })
}

const UpdateEmailAndGroup = (username, email, groupId, callback) => {
    postApi("/api/user/update_email_group", {username, email, group_id: groupId}, (err, data) => {
        callback(err, data)
    })
}

const setUserLogin = (userInfo) => {
    setStorage("user_info", userInfo)
}

const setToken = (token) => {
    setStorage("token", token)
}

const getToken = () => {
    return getStorage("token")
}

const setUserLogout = () => {
    removeStorage("user_info")
}

const checkUserHasLogin = () => {
    let userInfo = getStorage("user_info")
    return (userInfo != null && _.isPlainObject(userInfo))
}

const getUserInfo = () => {
    let userInfo = getStorage("user_info")
    if (userInfo != null && _.isPlainObject(userInfo)) {
        return userInfo
    }

    return null
}

export {
    login,
    logout,
    register,
    GetAllMenus,
    GetUserList,
    BanUser,
    UpdatePassword,
    UpdateEmailAndGroup,
    GetLoginUserInfo,

    getToken,
    setToken,
    setUserLogin,
    setUserLogout,
    checkUserHasLogin,
    getUserInfo,
   
}

