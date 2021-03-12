package main

import (
	"github.com/go-chi/chi"
	"net/http"
	"serverapp/src/workflowserver/services/taskservice"
)


func TaskRouter() http.Handler {
	r := chi.NewRouter()

	r.Post("/mine", taskservice.GetMyTaskList)
	r.Post("/update_status", taskservice.UpdateStatus)

	return r
}
