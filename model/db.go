package model

import (
	"github.com/fabiocody/easyrepay/utils"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func SetupDB() {
	var err error
	// TODO: postgres
	DB, err = gorm.Open(sqlite.Open(utils.Env().DatabaseUrl))
	utils.FailOnError(err)
	err = DB.AutoMigrate(&User{}, &Token{}, &Person{}, &Transaction{})
	utils.FailOnError(err)
	createFirstUser()
}

func createFirstUser() {
	var users []User
	if result := DB.Find(&users); result.Error != nil {
		log.Error(result.Error)
		return
	} else if len(users) == 0 {
		password, err := bcrypt.GenerateFromPassword([]byte(utils.Env().InitPassword), 10)
		if err != nil {
			log.Error(err)
			return
		}
		user := User{
			Username: utils.Env().InitUsername,
			Password: string(password),
			Name:     utils.Env().InitName,
		}
		log.Debug("Creating first user %#v", user)
		if result = DB.Save(&user); result.Error != nil {
			log.Error(result.Error)
		} else {
			log.Debug("Successfully created first user")
		}
	} else {
		log.Debug("Skipping first user creation: at least one user found")
	}
}
