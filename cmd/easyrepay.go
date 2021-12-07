package main

import (
	"github.com/fabiocody/easyrepay/controllers"
	"github.com/fabiocody/easyrepay/model"
	"github.com/fabiocody/easyrepay/utils"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func main() {
	log.SetFormatter(&log.TextFormatter{
		ForceColors:   true,
		FullTimestamp: true,
	})
	log.SetReportCaller(true)
	log.SetLevel(log.DebugLevel)
	model.SetupDB()
	r := gin.Default()
	controllers.SetupRoutes(r)
	log.Info("Running")
	err := r.Run()
	utils.FailOnError(err)
}
