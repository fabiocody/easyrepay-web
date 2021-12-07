package services

import (
	"errors"
	"github.com/fabiocody/easyrepay/model"
	"github.com/fabiocody/easyrepay/utils"
	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func GetUserByUsername(username string) (*model.User, error) {
	var user model.User
	if result := model.DB.First(&user, "username = ?", username); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			result.Error = utils.ErrHttpNotFound{Entity: "User", Field: "username", Value: username}
		}
		log.Error(result.Error)
		return nil, result.Error
	}
	return &user, nil
}

func GetUser(userId uint64) (*model.User, error) {
	var user model.User
	if result := model.DB.First(&user, userId); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			result.Error = utils.ErrHttpNotFound{Entity: "User", Field: "id", Value: userId}
		}
		log.Error(result.Error)
		return nil, result.Error
	}
	return &user, nil
}
