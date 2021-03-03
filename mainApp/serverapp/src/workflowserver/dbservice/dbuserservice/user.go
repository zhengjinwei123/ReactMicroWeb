package dbuserservice

import (
	"errors"
	"fmt"
	"serverapp/src/workflowserver/proto/dbproto"
	"serverapp/src/workflowserver/sql"
)

const table_name = "t_user"

func GetUser(username string, userInfo *dbproto.DbUserTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryOne(fmt.Sprintf("select * from %s where username='%s'",
		table_name, username), userInfo)
	if err != nil {
		return err
	}
	return nil
}

func AddUser(username, password, email string, groupId int) error {
	proxy := sql.GetMysqlProxy()

	cnt, err := proxy.GetCount(fmt.Sprintf("select `username` from `%s` where username='%s'", table_name, username))
	if err != nil {
		return err
	}

	if cnt > 0 {
		return errors.New(fmt.Sprintf("user %s has exists", username))
	}

	err = proxy.Insert(fmt.Sprintf("insert into `%s` (`username`,`password`,`email`,`group_id`) values(" +
		"'%s', '%s', '%s', %d)", table_name, username, password, email, groupId))

	return err
}

func DelUser(username string) error {
	proxy := sql.GetMysqlProxy()

	err, deleted := proxy.Delete(fmt.Sprintf("delete from `%s` where `username`='%s'", table_name, username))
	if err != nil {
		return err
	}
	if deleted <= 0 {
		return errors.New("delete user failed")
	}

	return nil
}

func UpdatePassword(username, password string) error {
	proxy := sql.GetMysqlProxy()

	err, updated := proxy.Update(fmt.Sprintf("update `%s` set `password`='%s' where `username`='%s'", table_name, password, username))
	if err != nil {
		return err
	}
	if updated <= 0 {
		return errors.New("data not changed")
	}
	return nil
}


func UpdateGroupId(username string, groupId int) error {
	proxy := sql.GetMysqlProxy()

	err, updated := proxy.Update(fmt.Sprintf("update `%s` set `group_id`=%d where `username`='%s'", table_name, groupId, username))
	if err != nil {
		return err
	}
	if updated <= 0 {
		return errors.New("data not changed")
	}
	return nil
}

func UpdateEmail(username, email string) error {
	proxy := sql.GetMysqlProxy()

	err, updated := proxy.Update(fmt.Sprintf("update `%s` set `email`=%d where `username`='%s'", table_name, email, username))
	if err != nil {
		return err
	}
	if updated <= 0 {
		return errors.New("data not changed")
	}
	return nil
}

func UpdateEmailAndGroup(username, email string, groupId int) error {
	proxy := sql.GetMysqlProxy()

	err, updated := proxy.Update(fmt.Sprintf("update `%s` set `email`='%s',`group_id`=%d where `username`='%s'", table_name, email, groupId, username))
	if err != nil {
		return err
	}
	if updated <= 0 {
		return errors.New("data not changed")
	}
	return nil
}

func UpdateStatus(username string, status int) error {
	proxy := sql.GetMysqlProxy()

	err, updated := proxy.Update(fmt.Sprintf("update `%s` set `status`=%d where `username`='%s'", table_name, status, username))
	if err != nil {
		return err
	}
	if updated <= 0 {
		return errors.New("data not changed")
	}
	return nil
}

func GetAllUsers(vList* []*dbproto.DbUserTableInfo) error {
	proxy := sql.GetMysqlProxy()

	err := proxy.QueryList(fmt.Sprintf("select * from %s",
		table_name), vList)
	if err != nil {
		return err
	}
	return nil
}


