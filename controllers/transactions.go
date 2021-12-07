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

func getTransactions(c *gin.Context) {
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
	if _, err = services.CheckUserHasAccessOnPersonId(userId, personId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	completed := false
	if c.Query("completed") != "" {
		completed, err = strconv.ParseBool(c.Query("completed"))
		if err != nil {
			log.Error(err)
			utils.ErrorResponse(c, err)
			return
		}
	}
	transactions, err := services.GetTransactions(personId, completed)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.JSON(http.StatusOK, transactions)
}

func saveTransaction(c *gin.Context) {
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
	if _, err = services.CheckUserHasAccessOnPersonId(userId, personId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	var transaction model.Transaction
	if err := c.BindJSON(&transaction); err != nil {
		log.Error(err)
		utils.ErrorResponse(c, err)
		return
	}
	transaction.PersonId = personId
	if err = services.SaveTransaction(&transaction); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.Status(http.StatusCreated)
}

func deleteAllTransactions(c *gin.Context) {
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
	if _, err = services.CheckUserHasAccessOnPersonId(userId, personId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	if err = services.DeleteAllTransactions(personId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func completeTransactions(c *gin.Context) {
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
	if _, err = services.CheckUserHasAccessOnPersonId(userId, personId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	if err = services.CompleteTransactions(personId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func deleteCompletedTransactions(c *gin.Context) {
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
	if _, err = services.CheckUserHasAccessOnPersonId(userId, personId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	if err = services.DeleteCompletedTransactions(personId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func deleteTransaction(c *gin.Context) {
	userId := c.GetUint64(AuthUserIdKey)
	if userId == 0 {
		utils.ErrorResponse(c, utils.ErrHttpUnauthorized{})
		return
	}
	transactionId, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		log.Error(err)
		utils.ErrorResponse(c, err)
		return
	}
	transaction, err := services.GetTransaction(transactionId)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	if _, err = services.CheckUserHasAccessOnPersonId(userId, transaction.PersonId); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	if err = services.DeleteTransaction(transaction); err != nil {
		utils.ErrorResponse(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
