package services

import (
	"fmt"
	"github.com/fabiocody/easyrepay/model"
	"github.com/fabiocody/easyrepay/utils"
	"github.com/golang-jwt/jwt"
	log "github.com/sirupsen/logrus"
	"strconv"
	"time"
)

type JwtClaims struct {
	jwt.StandardClaims
	Type model.TokenType `json:"type"`
}

func (claims *JwtClaims) GetUserId() (uint64, error) {
	return strconv.ParseUint(claims.Subject, 10, 64)
}

func createJwt(userId uint64, expiresIn time.Duration, tokenType model.TokenType) (tokenString string, err error) {
	claims := JwtClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().UTC().Add(expiresIn * time.Minute).Unix(),
			Subject:   strconv.FormatUint(userId, 10),
		},
		Type: tokenType,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(utils.Args.SecretKey())
}

func verifyToken(tokenString string, tokenType model.TokenType) (*JwtClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JwtClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return utils.Args.SecretKey(), nil
	})
	if claims, ok := token.Claims.(*JwtClaims); ok && token.Valid {
		if claims.Type != tokenType {
			errorMsg := "token types do not match"
			log.Error(errorMsg)
			return nil, fmt.Errorf(errorMsg)
		}
		return claims, nil
	} else if !ok {
		err = fmt.Errorf("failed converting claims to JwtClaims")
		log.Error(err)
		return nil, err
	} else {
		log.Error(err)
		return nil, err
	}
}
