import {postApi} from "../utils/util"

const getMyTaskList = (callback) => {
    postApi("/api/task/mine", {}, callback)
}

const getUsers = (callback) => {
    postApi("/api/users", {}, callback)
}

const updateStatus = (id, status, callback) => {
    postApi("/api/task/update_status", {id, status}, callback)
}

export {
    getMyTaskList,
    getUsers,
    updateStatus
}