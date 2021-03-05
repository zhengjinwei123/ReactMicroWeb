package dbproto

type DbUserTableInfo struct {
	UserName string `db:"username"`
	Password string `db:"password"`
	Email string `db:"email"`
	GroupId int `db:"group_id"`
	NickName string `db:"nickname"`
	Status int `db:"status"`
}

type DbGroupTableInfo struct {
	GroupId int `db:"id"`
	MenuStr string `db:"menus"`
	Desc string `db:"desc"`
	AuthStr string `db:"auths"`
}