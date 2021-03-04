package menumgr

import (
	"errors"
	"flag"
	"fmt"
	"serverapp/src/base/common"
	l4g "serverapp/src/base/log4go"
	"serverapp/src/workflowserver/dbservice/dbgroupservice"
	"serverapp/src/workflowserver/proto"
	"serverapp/src/workflowserver/proto/dbproto"
	"serverapp/src/workflowserver/proto/netproto"
	"sort"
	"strconv"
	"strings"
)

var menufile = flag.String("menuconfig", "../settings/menu.json", "")
var g_menuMgr *menuMgr = nil

type menuConfig struct {
	Comment []string `json:"comment"`
	MenuList [][]string `json:"menulist"`
}

func newMenuConfig() *menuConfig {
	return &menuConfig{}
}

type menuMgr struct {
	menuMap map[int]*proto.Menu
	menuIdTree map[int][]int
	groupMenuMap map[int][]*netproto.Menus
}

func newMenuMgr() *menuMgr {
	return &menuMgr{
		menuMap: make(map[int]*proto.Menu, 0),
		menuIdTree: make(map[int][]int, 0),
		groupMenuMap: make(map[int][]*netproto.Menus, 0),
	}
}

func GetMenuMgr() *menuMgr {
	if g_menuMgr == nil {
		g_menuMgr = newMenuMgr()
	}

	return g_menuMgr
}


func (this *menuMgr) LoadMenu() error {
	var menuconfig = newMenuConfig()

	if err := common.LoadJsonConfig(*menufile, menuconfig); err != nil {
		return errors.New(fmt.Sprintf("load menu config %v failed: %v", *menufile, err))
	}

	sortIndex := 1
	for _, vList := range menuconfig.MenuList {
		parentMenuId := 0

		for index, v := range vList {
			vv := strings.Split(v, ",")

			if len(vv) != 4 {
				return errors.New(fmt.Sprintf("menu init error: valid len of menu[%s]", v))
			}

			id, _ := strconv.Atoi(vv[0])
			name := vv[1]
			icon := vv[2]
			link := vv[3]

			tmenu := &proto.Menu{
				Id: id,
				Name: name,
				Icon: icon,
				Link: link,
				Sort: sortIndex,
			}

			if index == 0 {
				parentMenuId = id
				tmenu.ParentId = 0

				this.menuIdTree[parentMenuId] = make([]int, 0)
			} else {
				tmenu.ParentId = parentMenuId
				this.menuIdTree[parentMenuId] = append(this.menuIdTree[parentMenuId], id)
			}

			this.menuMap[tmenu.Id] = tmenu

			sortIndex += 1
		}
	}

	if err := this.LoadAllGroupMenus(); err != nil {
		return err
	}

	l4g.Debug("menu init success")

	return nil
}

func (this *menuMgr) LoadMenuByGroupId(groupId int, menuStr string) error {

	menuIdList := make([]string, 0)
	if menuStr != "" {
		menuIdList = strings.Split(menuStr, ",")
	}

	idTree := make(map[int][]int, 0)

	if _, ok := this.groupMenuMap[groupId]; ok {
		if groupId != 1 {
			delete(this.groupMenuMap, groupId)
		} else {
			return nil
		}
	}

	this.groupMenuMap[groupId] = make([]*netproto.Menus, 0)
	if groupId == 1 {
		idTree = this.menuIdTree
	} else {
		for _, strId := range menuIdList {
			menuId, err := strconv.Atoi(strId)
			if err != nil {
				continue
			}

			if menuInfo, ok := this.menuMap[menuId]; ok {

				if menuInfo.ParentId != 0 {
					if _, exists := idTree[menuInfo.ParentId]; !exists {
						idTree[menuInfo.ParentId] = make([]int, 0)
					}

					idTree[menuInfo.ParentId] = append(idTree[menuInfo.ParentId], menuInfo.Id)
				}
			}
		}
	}

	// 排序， 让菜单配置顺序显示菜单
	sortedKeys := make([]int, len(idTree))
	for parentId, _ := range idTree {
		sortedKeys = append(sortedKeys, parentId)
	}
	sort.Ints(sortedKeys)

	for _, parentId := range sortedKeys {

		childIdList, _ := idTree[parentId]

		menus := &netproto.Menus{}

		if menuInfo, exists := this.menuMap[parentId]; exists {
			pmenu := &netproto.Menu{}
			pmenu.Id = menuInfo.Id
			pmenu.Name = menuInfo.Name
			pmenu.Icon = menuInfo.Icon
			pmenu.Link = menuInfo.Link

			menus.Parent = pmenu
		} else {
			continue
		}
		menus.Childs = make([]*netproto.Menu, 0)

		for _, childId := range childIdList {
			if menuInfo, exists := this.menuMap[childId]; exists {
				cmenu := &netproto.Menu{}
				cmenu.Id = menuInfo.Id
				cmenu.Name = menuInfo.Name
				cmenu.Icon = menuInfo.Icon
				cmenu.Link = menuInfo.Link

				menus.Childs = append(menus.Childs, cmenu)
			} else {
				continue
			}
		}

		this.groupMenuMap[groupId] = append(this.groupMenuMap[groupId], menus)
	}

	return nil
}

func (this *menuMgr) LoadAllGroupMenus() error {

	var groupAll []*dbproto.DbGroupTableInfo

	if err := dbgroupservice.GetAll(&groupAll); err != nil {
		return err
	}

	for _, v := range groupAll {
		if err := this.LoadMenuByGroupId(v.GroupId, v.MenuStr); err != nil {
			return err
		}
	}

	return nil
}

func (this *menuMgr) GetMenusByGroupId(groupId int) ([]*netproto.Menus) {
	if menus, ok := this.groupMenuMap[groupId]; ok {
		return menus
	}
	return nil
}