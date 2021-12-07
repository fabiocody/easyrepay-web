package controllers

import (
	"github.com/fabiocody/easyrepay/services"
	"github.com/fabiocody/easyrepay/utils"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"net/http"
)

func getMe(c *gin.Context) {
	userId := c.GetUint64(AuthUserIdKey)
	if userId == 0 {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	user, err := services.GetUser(userId)
	if err != nil {
		log.Error(err)
		utils.ErrorResponse(c, err)
		return
	}
	c.JSON(http.StatusOK, user)
}
