package usermgr

var g_userMgr *UserMgr = nil

type UserInfo struct {
	Username string
	GroupId int
	Status int
}


type UserMgr struct {
	userMap map[string]*UserInfo
}


func (this *UserMgr) Login(username string, status int, groupId int) {
	this.userMap[username] = &UserInfo{
		Username: username,
		Status: status,
		GroupId: groupId,
	}
}

func (this *UserMgr) Logout(username string) {
	delete(this.userMap, username)
}

func (this *UserMgr) BanUser(username string, status int) {
	if user, ok := this.userMap[username]; ok {
		user.Status = status
	}
}

func (this *UserMgr) GetGroupId(username string) int {
	if user, ok := this.userMap[username]; ok {
		return user.GroupId
	}
	return 0
}

func (this *UserMgr) UserHasBanded(username string) bool {
	if user, ok := this.userMap[username]; ok {
		return user.Status != 0
	}

	return false
}

func (this *UserMgr) Clear() {
	for username, _ := range this.userMap {
		delete(this.userMap, username)
	}
}


func GetUserMgr() *UserMgr {
	if g_userMgr == nil {
		g_userMgr = &UserMgr{
			userMap: make(map[string]*UserInfo, 0),
		}
	}

	return g_userMgr
}

