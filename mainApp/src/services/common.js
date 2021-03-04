import {postApi} from "../utils/util"
import _ from "lodash"

const GetServerRunInfo = (callback) => {
    postApi("/api/server_run_info", {}, callback)
}

export {
    GetServerRunInfo
}