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
	"serverapp/src/workflowserver/services"
	"serverapp/src/workflowserver/services/taskservice"
	"serverapp/src/workflowserver/sql"
	"serverapp/src/workflowserver/utils/idgenerator"
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

	// timeZone check
	if _, err := common.NowTimeIn(serverConfig.TimeZone); err != nil {
		common.PanicExt(err.Error())
	}

	if err := sql.GetMysqlProxy().Init(config.GetServerConfig().GetMysqlAddr()); err != nil {
		common.PanicExt(err.Error())
	}

	if err := idgenerator.InitIdWorker(); err != nil {
		common.PanicExt(err.Error())
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(20 * time.Second))

	r.Route("/api", func(r chi.Router) {
		r.Use(JwtAuthenticationMiddleware)

		r.Mount("/task", TaskRouter())

		r.Post("/users", services.GetUsers)
	})

	r.Route("/upload", func(r chi.Router) {
		r.Use(UploadFileMiddleware)

		r.Post("/taskadd", taskservice.TaskAdd)

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
		_ = httpServer.Shutdown(ctx)
		_ = common.DeleteFile(*pidfile)
	}
}