package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"serverapp/src/base/common"
	l4g "serverapp/src/base/log4go"
	"serverapp/src/workflowserver/config"
	"serverapp/src/workflowserver/manager/eventmgr"
	"serverapp/src/workflowserver/manager/lanmgr"
	"serverapp/src/workflowserver/manager/menumgr"
	"serverapp/src/workflowserver/services"
	"serverapp/src/workflowserver/session/redissession"
	"serverapp/src/workflowserver/sql"
	"syscall"
	"time"
)

var g_signal = make(chan os.Signal, 1)

var pidfile = flag.String("pidfile", "./run/workflowserver.pid", "")


func main() {

	defer func() {
		l4g.Info("defer close")
		if err := recover(); err != nil {
			l4g.Close()
			common.PanicExt("Bug")
		}
	}()

	runtime.GOMAXPROCS(runtime.NumCPU())
	flag.Parse()

	if err := config.LoadServerConfig(); err != nil {
		common.PanicExt(err.Error())
	}

	serverConfig := config.GetServerConfig()
	l4g.LoadConfigurationWithPid(serverConfig.Log.Config)
	defer l4g.Close()

	if err := sql.GetMysqlProxy().Init(config.GetServerConfig().GetMysqlAddr()); err != nil {
		common.PanicExt(err.Error())
	}

	if err := redissession.Start(); err != nil {
		common.PanicExt(err.Error())
	}

	menuMgr := menumgr.GetMenuMgr()
	if err := menuMgr.LoadMenu(); err != nil {
		common.PanicExt(err.Error())
	}

	if err := lanmgr.GetLanMgr().Load(serverConfig.Language); err != nil {
		common.PanicExt(err.Error())
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(20 * time.Second))

	r.Route("/api", func(r chi.Router) {
		r.Use(authMiddleware)

		r.Post("/server_run_info", services.ServerRunInformation)

		r.Mount("/user", UserRouter())
		r.Mount("/group", GroupRouter())
	})

	httpServer := &http.Server{Addr: serverConfig.Http, Handler: r}
	go httpServer.ListenAndServe()

	pid := fmt.Sprintf("%d", os.Getpid())
	if err := common.FilePutContents(*pidfile, pid); err != nil {
		common.PanicExt(err.Error())
	}

	l4g.Info("server start at %s", serverConfig.Http)

	listenSignal(context.Background(), httpServer)
}

func listenSignal(ctx context.Context, httpServer *http.Server) {
	signal.Notify(g_signal, os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT, syscall.SIGHUP, syscall.SIGINT)

	select {
	case sig := <- g_signal:
		l4g.Info("catch signal %s, server ready to shutdown.", sig.String())
		eventmgr.ServerShutdown()
		_ = httpServer.Shutdown(ctx)
		_ = common.DeleteFile(*pidfile)
	}
}