package services

import (
	"errors"
	"github.com/fabiocody/easyrepay/model"
	"github.com/fabiocody/easyrepay/utils"
	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func GetPeopleByUserId(userId uint64) (*[]model.Person, error) {
	var people []model.Person
	if result := model.DB.Preload("Transactions").Find(&people, "user_id = ?", userId).Order("name"); result.Error != nil {
		log.Error(result.Error)
		return nil, result.Error
	}
	return &people, nil
}

func GetPersonDetailDto(person *model.Person) (*model.PersonDetailDto, error) {
	transactions, err := GetTransactions(person.ID, false)
	if err != nil {
		return nil, err
	}
	return &model.PersonDetailDto{
		ID:    person.ID,
		Name:  person.Name,
		Count: uint64(len(*transactions)),
		Total: GetTotalFromTransactions(transactions),
	}, nil
}

func SavePerson(person *model.Person) error {
	var homonyms int64
	if result := model.DB.Model(&model.Person{}).Where("user_id = ? and name = ?", person.UserId, person.Name).Count(&homonyms); result.Error != nil {
		log.Error(result.Error)
		return result.Error
	}
	if homonyms > 0 {
		err := utils.ErrHttpConflict{Entity: "Person", Field: "name", Value: person.Name}
		log.Error(err)
		return err
	}
	if result := model.DB.Save(person); result.Error != nil {
		log.Error(result.Error)
		return result.Error
	}
	return nil
}

func GetPerson(personId uint64) (*model.Person, error) {
	var person model.Person
	if result := model.DB.First(&person, personId); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			result.Error = utils.ErrHttpNotFound{Entity: "Person", Field: "id", Value: personId}
		}
		log.Error(result.Error)
		return nil, result.Error
	}
	return &person, nil
}

func DeletePerson(person *model.Person) error {
	if result := model.DB.Delete(person); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			result.Error = utils.ErrHttpNotFound{Entity: "Person", Field: "id", Value: person.ID}
		}
		log.Error(result.Error)
		return result.Error
	}
	return nil
}

func CheckUserHasAccessOnPerson(userId uint64, person *model.Person) (*model.Person, error) {
	if person.UserId != userId {
		log.Errorf("User %d cannot access person %d", userId, person.ID)
		return person, utils.ErrHttpForbidden{Entity: "Person", Field: "id", Value: person.ID}
	}
	return person, nil
}

func CheckUserHasAccessOnPersonId(userId uint64, personId uint64) (*model.Person, error) {
	person, err := GetPerson(personId)
	if err != nil {
		return nil, err
	}
	return CheckUserHasAccessOnPerson(userId, person)
}
