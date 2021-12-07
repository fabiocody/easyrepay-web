package controllers

import (
	"github.com/fabiocody/easyrepay/angular"
	"github.com/gin-gonic/gin"
	"net/http"
)

func getHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":   "UP",
		"frontend": angular.Status,
	})
}

func getVersion(c *gin.Context) {
	c.Status(http.StatusNotImplemented)
	// TODO: implement
}
