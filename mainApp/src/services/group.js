import {postApi } from "../utils/util"
import _ from "lodash"

const addGroup = (group_name, menus, callback) => {
    postApi("/api/group/add", {group_name, menus}, (err, data) => {
        callback(err, data)
    })
}

const updateGroupMenus = (group_id, menus, callback) => {
    postApi("/api/group/update_menus", {group_id, menus}, (err, data) => {
        callback(err, data)
    })
}

const getAllGroups = (callback) => {
    postApi("/api/group/all", {}, (err, data) => {
        callback(err, data)
    })
}

const deleteGroup = (group_id, callback) => {
    postApi("/api/group/remove", {group_id}, (err, data) => {
        callback(err, data)
    })
}

export {
    addGroup,
    updateGroupMenus,
    getAllGroups,
    deleteGroup
}