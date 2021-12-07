package controllers

import (
	"github.com/fabiocody/easyrepay/services"
	"github.com/fabiocody/easyrepay/utils"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
)

func login(c *gin.Context) {
	userId := c.GetUint64(AuthUserIdKey)
	if userId == 0 {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	tokens, err := services.Login(userId)
	if err != nil {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	c.JSON(http.StatusOK, tokens)
}

func refreshToken(c *gin.Context) {
	token, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		log.Error(err)
		utils.ErrorResponse(c, err)
		return
	}
	tokens, err := services.RefreshToken(string(token))
	if err != nil {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	c.JSON(http.StatusOK, tokens)
}

func logout(c *gin.Context) {
	userId := c.GetUint64(AuthUserIdKey)
	if userId == 0 {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	token, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		log.Error(err)
		utils.ErrorResponse(c, err)

		return
	}
	services.Logout(userId, string(token))
	c.Status(http.StatusNoContent)
}
