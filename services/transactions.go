package services

import (
	"errors"
	"github.com/fabiocody/easyrepay/model"
	"github.com/fabiocody/easyrepay/utils"
	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func GetTotalFromTransactions(transactions *[]model.Transaction) float64 {
	total := 0.0
	if transactions == nil {
		return total
	}
	for _, t := range *transactions {
		switch t.Type {
		case model.TransactionTypeCredit, model.TransactionTypeSettleDebt:
			total += t.Amount
		case model.TransactionTypeDebt, model.TransactionTypeSettleCredit:
			total -= t.Amount
		}
	}
	return total
}

func GetTransactions(personId uint64, completed bool) (*[]model.Transaction, error) {
	var transactions []model.Transaction
	if result := model.DB.Find(&transactions, "person_id = ? and completed = ?", personId, completed).Order("date"); result.Error != nil {
		log.Error(result.Error)
		return nil, result.Error
	}
	return &transactions, nil
}

func SaveTransaction(transaction *model.Transaction) error {
	if result := model.DB.Save(transaction); result.Error != nil {
		log.Error(result.Error)
		return result.Error
	}
	return nil
}

func DeleteAllTransactions(personId uint64) error {
	if result := model.DB.Delete(&model.Transaction{}, "person_id = ?", personId); result.Error != nil {
		log.Error(result.Error)
		return result.Error
	}
	return nil
}

func CompleteTransactions(personId uint64) error {
	if result := model.DB.Model(&model.Transaction{}).Where("person_id = ?", personId).Update("completed", true); result.Error != nil {
		log.Error(result.Error)
		return result.Error
	}
	return nil
}

func DeleteCompletedTransactions(personId uint64) error {
	if result := model.DB.Delete(&model.Transaction{}, "person_id = ? and completed = ?", personId, true); result.Error != nil {
		log.Error(result.Error)
		return result.Error
	}
	return nil
}

func GetTransaction(id uint64) (*model.Transaction, error) {
	var transaction model.Transaction
	if result := model.DB.First(&transaction, id); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			result.Error = utils.ErrHttpNotFound{Entity: "Transaction", Field: "id", Value: id}
		}
		log.Error(result.Error)
		return nil, result.Error
	}
	return &transaction, nil
}

func DeleteTransaction(transaction *model.Transaction) error {
	if result := model.DB.Delete(transaction); result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			result.Error = utils.ErrHttpNotFound{Entity: "Transaction", Field: "id", Value: transaction.ID}
		}
		log.Error(result.Error)
		return result.Error
	}
	return nil
}
