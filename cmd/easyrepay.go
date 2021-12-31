package main

import (
	"github.com/alexflint/go-arg"
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
	arg.MustParse(&utils.Args)
	if utils.Args.Debug {
		log.SetLevel(log.DebugLevel)
	} else {
		log.SetLevel(log.InfoLevel)
	}
	utils.CheckSecretKey()
	model.SetupDB()
	r := gin.Default()
	controllers.SetupRoutes(r)
	log.Info("Running")
	err := r.Run()
	utils.FailOnError(err)
}
