package model

import (
	"gorm.io/gorm"
	"time"
)

type BaseModel struct {
	ID        uint64         `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type User struct {
	BaseModel
	Username string   `gorm:"not null;unique" json:"username"`
	Password string   `gorm:"not null" json:"-"`
	Name     string   `gorm:"not null" json:"name"`
	Tokens   []Token  `json:"-"`
	People   []Person `json:"people,omitempty"`
}

type Token struct {
	ID        uint64    `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"-"`
	Token     string    `gorm:"not null" json:"token"`
	UserId    uint64    `gorm:"not null" json:"userId"`
}

type Person struct {
	BaseModel
	Name         string        `gorm:"not null" json:"name" binding:"required"`
	UserId       uint64        `gorm:"not null" json:"-"`
	Transactions []Transaction `json:"transactions,omitempty"`
}

type Transaction struct {
	BaseModel
	Type        TransactionType `gorm:"not null" json:"type" binding:"required"`
	Amount      float64         `gorm:"not null" json:"amount" binding:"required"`
	Description string          `gorm:"not null" json:"description" binding:"required"`
	Completed   bool            `gorm:"not null" json:"completed"`
	Date        time.Time       `gorm:"not null" json:"date" binding:"required"`
	PersonId    uint64          `gorm:"not null" json:"personId"`
}

type TransactionType string

const (
	TransactionTypeCredit       TransactionType = "CREDIT"
	TransactionTypeDebt         TransactionType = "DEBT"
	TransactionTypeSettleCredit TransactionType = "SETTLE_CREDIT"
	TransactionTypeSettleDebt   TransactionType = "SETTLE_DEBT"
)

type TokenType string

const (
	TokenTypeAccess  TokenType = "ACCESS"
	TokenTypeRefresh TokenType = "REFRESH"
)
