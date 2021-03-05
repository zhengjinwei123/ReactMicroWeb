package main

import (
	"github.com/go-chi/chi"
	"net/http"
	"serverapp/src/platformserver/services/groupservice"
	"serverapp/src/platformserver/services/userservice"
)

func UserRouter() http.Handler {
	r := chi.NewRouter()

	r.Post("/login", userservice.Login)
	r.Post("/logout", userservice.Logout)
	r.Post("/remove", userservice.Delete)
	r.Post("/register", userservice.Register)
	r.Post("/all_menus", userservice.AllMenus)
	r.Post("/list", userservice.AllUsers)
	r.Post("/ban", userservice.UserBan)
	r.Post("/update_email_group", userservice.UpdateEmailAndGroup)
	r.Post("/update_password", userservice.UpdatePassword)
	r.Post("/user_info", userservice.GetUserInfo)

	return r
}

func GroupRouter() http.Handler {
	r := chi.NewRouter()

	r.Post("/add", groupservice.Add)
	r.Post("/remove", groupservice.Delete)
	r.Post("/all", groupservice.AllGroups)
	r.Post("/update_menus", groupservice.UpdateMenus)
	return r
}