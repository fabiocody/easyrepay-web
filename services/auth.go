package services

import (
	"encoding/base64"
	"fmt"
	"github.com/fabiocody/easyrepay/model"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"strings"
)

const (
	AccessTokenExp  = 15          // MINUTES
	RefreshTokenExp = 7 * 24 * 60 // MINUTES
)

func Login(userId uint64) (tokenDto *model.TokenDto, err error) {
	access, err := getAccessToken(userId)
	if err != nil {
		log.Error(err)
		return nil, err
	}
	refresh, err := getRefreshToken(userId)
	if err != nil {
		log.Error(err)
		return nil, err
	}
	return &model.TokenDto{
		Access:  access,
		Refresh: refresh,
	}, nil
}

func RefreshToken(refreshToken string) (tokenDto *model.TokenDto, err error) {
	var token model.Token
	if result := model.DB.First(&token, "token = ?", refreshToken); result.Error != nil {
		log.Error(result.Error)
		return nil, result.Error
	}
	claims, err := verifyToken(refreshToken, model.TokenTypeRefresh)
	if err != nil {
		log.Error(err)
		return nil, err
	}
	userId, err := claims.GetUserId()
	if err != nil {
		log.Error(err)
		return nil, err
	}
	if result := model.DB.Delete(&token); result.Error != nil {
		log.Error(result.Error)
	}
	return Login(userId)
}

func Logout(userId uint64, refreshToken string) {
	var token model.Token
	if result := model.DB.First(&token, "token = ?", refreshToken); result.Error != nil {
		log.Warning(result.Error)
		return
	}
	claims, err := verifyToken(refreshToken, model.TokenTypeRefresh)
	if err != nil {
		log.Warning(err)
		return
	}
	claimsUserId, err := claims.GetUserId()
	if err != nil {
		log.Warning(err)
		return
	}
	if claimsUserId == userId {
		if result := model.DB.Delete(&token); result.Error != nil {
			log.Warning(result.Error)
		}
	}
}

func ExtractBasicCredentials(authHeader string) (username string, password string, err error) {
	credentials := authHeader[6:]
	bytes, err := base64.StdEncoding.DecodeString(credentials)
	if err != nil {
		log.Error(err)
		return "", "", err
	}
	decoded := strings.SplitN(string(bytes), ":", 2)
	if len(decoded) < 2 {
		err = fmt.Errorf("less than 2 splits")
		log.Error(err)
		return "", "", err
	}
	return decoded[0], decoded[1], nil
}

func ValidateUser(username string, password string) (userId uint64, err error) {
	user, err := GetUserByUsername(username)
	if err != nil {
		return 0, err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		log.Error(err)
		return 0, err
	}
	return user.ID, nil
}

func ExtractJwtCredentials(authHeader string) (userId uint64, err error) {
	token := authHeader[7:]
	claims, err := verifyToken(token, model.TokenTypeAccess)
	if err != nil {
		return 0, err
	}
	userId, err = claims.GetUserId()
	if err != nil {
		log.Error(err)
		return 0, err
	}
	return userId, err
}

func getAccessToken(userId uint64) (tokenString string, err error) {
	tokenString, err = createJwt(userId, AccessTokenExp, model.TokenTypeAccess)
	if err != nil {
		log.Error(err)
	}
	return tokenString, err
}

func getRefreshToken(userId uint64) (tokenString string, err error) {
	tokenString, err = createJwt(userId, RefreshTokenExp, model.TokenTypeRefresh)
	if err != nil {
		log.Error(err)
		return "", err
	}
	err = updateRefreshTokens(userId, tokenString)
	if err != nil {
		log.Error(err)
	}
	return tokenString, err
}

func updateRefreshTokens(userId uint64, refreshToken string) error {
	return model.DB.Transaction(func(tx *gorm.DB) error {
		var tokens []model.Token
		if result := model.DB.Find(&tokens, "user_id = ?", userId); result.Error != nil {
			log.Error(result.Error)
			return result.Error
		}
		for _, token := range tokens {
			_, err := verifyToken(token.Token, model.TokenTypeRefresh)
			if err != nil {
				tx.Delete(&token)
			}
		}
		token := &model.Token{
			Token:  refreshToken,
			UserId: userId,
		}
		if result := tx.Save(token); result.Error != nil {
			log.Error(result.Error)
			return result.Error
		}
		return nil
	})
}
