import CONSTS from "../proto/consts.js"

const initialState = {}

export default function userinfo(state = initialState, action) {
    switch(action.type) {
        case CONSTS.ACTIONS.USERINFO_LOGIN:
            return action.data
        case CONSTS.ACTIONS.USERINFO_LOGOUT:
            return {}
        default:
            return state
    }
}