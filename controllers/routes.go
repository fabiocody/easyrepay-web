package controllers

import (
	"github.com/fabiocody/easyrepay/angular"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strings"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	api.GET("/health", getHealth)
	api.GET("/version", getVersion)

	// AUTH
	auth := api.Group("/auth")
	auth.POST("/login", basicAuth, login)
	auth.POST("/refresh", refreshToken)
	auth.POST("/logout", jwtAuth, logout)

	// USER
	user := api.Group("/user", jwtAuth)
	user.GET("", getMe)

	// PEOPLE
	people := api.Group("/people", jwtAuth)
	people.GET("", getPeople)
	people.POST("", savePerson)
	people.GET("/:id", getPerson)
	people.DELETE("/:id", deletePerson)

	// TRANSACTIONS
	transactions := api.Group("/people/:id/transactions", jwtAuth)
	transactions.GET("", getTransactions)
	transactions.POST("", saveTransaction)
	transactions.DELETE("", deleteAllTransactions)
	transactions.POST("/completed", completeTransactions)
	transactions.DELETE("/completed", deleteCompletedTransactions)
	api.DELETE("/transactions/:id", jwtAuth, deleteTransaction)

	// FRONTEND
	f, err := angular.Files().Open("index.html")
	if err == nil {
		_ = f.Close()
		r.NoRoute(serveFrontend("/", angular.Files()))
	} else {
		log.Warning("Skipping frontend")
	}
}

func serveFrontend(urlPrefix string, fs http.FileSystem) gin.HandlerFunc {
	fileServer := http.FileServer(fs)
	if urlPrefix != "" {
		fileServer = http.StripPrefix(urlPrefix, fileServer)
	}
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/api") {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}
		f, err := fs.Open(path)
		if err != nil {
			c.Request.URL.Path = "/"
		} else {
			defer func(f http.File) {
				_ = f.Close()
			}(f)
		}
		fileServer.ServeHTTP(c.Writer, c.Request)
		c.Abort()
	}
}
