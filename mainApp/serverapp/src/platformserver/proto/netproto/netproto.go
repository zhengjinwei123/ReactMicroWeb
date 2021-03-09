package netproto

type Menu struct {
	Id int `json:"id"`
	Name string `json:"name"`
	Icon string `json:"icon"`
	Link string `json:"module"`
}

type Menus struct {
	Parent *Menu `json:"f"`
	Childs []*Menu `json:"c"`
}

type NetUserLoginRequest struct {
	UserName string `http:"username"`
	Password string `http:"password"`
}

type NetUserDelRequest struct {
	UserName string `http:"username"`
}

type NetUserRegisterRequest struct {
	UserName string `http:"username"`
	NickName string `http:"nickname"`
	Password string `http:"password"`
	Email string `http:"email"`
	GroupId int `http:"group_id"`
}

type NetUserBanRequest struct {
	UserName string `http:"username"`
	Status int `http:"status"`
}

type NetGroupAddRequest struct {
	GroupName string `http:"group_name"`
	Menus string `http:"menus"`
}

type NetGroupUpdateMenuRequest struct {
	GroupId int `http:"group_id"`
	Menus string `http:"menus"`
}

type NetGroupDeleteRequest struct {
	GroupId int `http:"group_id"`
}

type NetUpdateEmailAndGroupRequest struct {
	UserName string `http:"username"`
	Email string `http:"email"`
	GroupId int `http:"group_id"`
	NickName string `http:"nickname"`
}

type NetUserUpdatePasswordRequest struct {
	UserName string `http:"username"`
	Password string `http:"password"`
}

type H map[string]interface{}
