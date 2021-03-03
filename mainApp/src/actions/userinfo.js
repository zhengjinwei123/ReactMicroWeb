import CONSTS from "../proto/consts.js"

export function login(data) {
    return {
        type: CONSTS.ACTIONS.USERINFO_LOGIN,
        data
    }
}

export function logout() {
    return {
        type: CONSTS.ACTIONS.USERINFO_LOGOUT,
        data: null
    }
}