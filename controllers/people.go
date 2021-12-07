package controllers

import (
	"github.com/fabiocody/easyrepay/model"
	"github.com/fabiocody/easyrepay/services"
	"github.com/fabiocody/easyrepay/utils"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strconv"
)

func getPeople(c *gin.Context) {
	userId := c.GetUint64(AuthUserIdKey)
	if userId == 0 {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	people, err := services.GetPeopleByUserId(userId)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	peopleDetail := make([]model.PersonDetailDto, len(*people))
	for i, p := range *people {
		detail, err := services.GetPersonDetailDto(&p)
		if err != nil {
			utils.ErrorResponse(c, err)
			return
		}
		peopleDetail[i] = *detail
	}
	c.JSON(http.StatusOK, peopleDetail)
}

func savePerson(c *gin.Context) {
	userId := c.GetUint64(AuthUserIdKey)
	if userId == 0 {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	var person model.Person
	if err := c.BindJSON(&person); err != nil {
		log.Error(err)
		utils.ErrorResponse(c, err)
		return
	}
	person.UserId = userId
	if err := services.SavePerson(&person); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.Status(http.StatusCreated)
}

func getPerson(c *gin.Context) {
	userId := c.GetUint64(AuthUserIdKey)
	if userId == 0 {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	personId, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		log.Error(err)
		utils.ErrorResponse(c, err)
		return
	}
	person, err := services.CheckUserHasAccessOnPersonId(userId, personId)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.JSON(http.StatusOK, person)
}

func deletePerson(c *gin.Context) {
	userId := c.GetUint64(AuthUserIdKey)
	if userId == 0 {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	personId, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		log.Error(err)
		utils.ErrorResponse(c, err)
		return
	}
	person, err := services.CheckUserHasAccessOnPersonId(userId, personId)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	if err = services.DeletePerson(person); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
