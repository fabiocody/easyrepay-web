package utils

import (
	"fmt"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"net/http"
)

func FailOnError(err error) {
	if err != nil {
		log.Panic(err)
	}
}

type ErrEnvNotFound struct {
	Key string `json:"key"`
}

func (err ErrEnvNotFound) Error() string {
	return fmt.Sprintf("could not find environment variable %s\n", err.Key)
}

// HTTP

func ErrorResponse(c *gin.Context, err error) {
	if err == nil {
		return
	}
	json := gin.H{"error": err.Error()}
	switch err.(type) {
	case ErrHttpNotFound:
		c.AbortWithStatusJSON(http.StatusNotFound, json)
	case ErrHttpUnauthorized:
		c.AbortWithStatusJSON(http.StatusUnauthorized, json)
	case ErrHttpConflict:
		c.AbortWithStatusJSON(http.StatusConflict, json)
	case ErrHttpForbidden:
		c.AbortWithStatusJSON(http.StatusForbidden, json)
	default:
		c.AbortWithStatusJSON(http.StatusInternalServerError, json)
	}
}

type ErrHttpNotFound struct {
	Entity string
	Field  string
	Value  interface{}
}

func (err ErrHttpNotFound) Error() string {
	return fmt.Sprintf("entity %s with %s '%v' not found", err.Entity, err.Field, err.Value)
}

type ErrHttpUnauthorized struct{}

func (err ErrHttpUnauthorized) Error() string {
	return "Unauthorized"
}

type ErrHttpConflict struct {
	Entity string
	Field  string
	Value  interface{}
}

func (err ErrHttpConflict) Error() string {
	return fmt.Sprintf("a %s with %s '%v' is already present in the database", err.Entity, err.Field, err.Value)
}

type ErrHttpForbidden struct {
	Entity string
	Field  string
	Value  interface{}
}

func (err ErrHttpForbidden) Error() string {
	return fmt.Sprintf("access to entity %s with %s '%v' is forbidden", err.Entity, err.Field, err.Value)
}
