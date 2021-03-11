import {postApi} from "../utils/util"

const addTask = (taskInfo, callback) => {
    postApi("/api/user_info", taskInfo, callback)
}

export {
    addTask
}