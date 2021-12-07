package controllers

import (
	"github.com/fabiocody/easyrepay/services"
	"github.com/fabiocody/easyrepay/utils"
	"github.com/gin-gonic/gin"
)

const AuthUserIdKey = "user"

func basicAuth(c *gin.Context) {
	username, password, err := services.ExtractBasicCredentials(c.GetHeader("Authorization"))
	if err != nil {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	userId, err := services.ValidateUser(username, password)
	if err != nil {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	c.Set(AuthUserIdKey, userId)
	c.Next()
}

func jwtAuth(c *gin.Context) {
	userId, err := services.ExtractJwtCredentials(c.GetHeader("Authorization"))
	if err != nil {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	_, err = services.GetUser(userId)
	if err != nil {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	c.Set(AuthUserIdKey, userId)
	c.Next()
}
