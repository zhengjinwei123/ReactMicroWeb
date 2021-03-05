package dbgroupservice

import (
	"errors"
	"fmt"
	"serverapp/src/platformserver/proto/dbproto"
	"serverapp/src/platformserver/sql"
)

const table_name = "t_group"

func GetAll(vList* []*dbproto.DbGroupTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryList(fmt.Sprintf("select * from %s",
		table_name), vList)
	if err != nil {
		return err
	}
	return nil
}

func GetGroup(groupId int, v *dbproto.DbGroupTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryOne(fmt.Sprintf("select * from %s where id=%d",
		table_name, groupId), v)
	if err != nil {
		return err
	}
	return nil
}

func GetGroupByName(groupName string, v *dbproto.DbGroupTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryOne(fmt.Sprintf("select * from %s where `desc`='%s'",
		table_name, groupName), v)
	if err != nil {
		return err
	}
	return nil
}

func UpdateMenu(groupId int, menusStr string) error {
	proxy := sql.GetMysqlProxy()

	err, updated := proxy.Update(fmt.Sprintf("update `%s` set `menus`='%s' where `id`=%d", table_name, menusStr, groupId))
	if err != nil {
		return err
	}
	if updated <= 0 {
		return errors.New("data not changed")
	}
	return nil
}

func DeleteGroup(groupId int) error {
	proxy := sql.GetMysqlProxy()

	err, deleted := proxy.Delete(fmt.Sprintf("delete from `%s` where `id`=%d", table_name, groupId))
	if err != nil {
		return err
	}
	if deleted <= 0 {
		return errors.New("delete group failed")
	}

	return nil
}

func AddGroup(groupName string, menus string, auths string) error {
	proxy := sql.GetMysqlProxy()

	cnt, err := proxy.GetCount(fmt.Sprintf("select `desc` from `%s` where `desc`='%s'", table_name, groupName))
	if err != nil {
		return err
	}

	if cnt > 0 {
		return errors.New(fmt.Sprintf("group %s has exists", groupName))
	}

	err = proxy.Insert(fmt.Sprintf("insert into `%s` (`desc`,`menus`,`auths`) values(" +
		"'%s', '%s', '%s')", table_name, groupName, menus, auths))

	return err
}