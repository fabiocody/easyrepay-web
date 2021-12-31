package utils

import (
	"encoding/base64"
	log "github.com/sirupsen/logrus"
)

type ArgsType struct {
	Database        string `arg:"env:DATABASE" default:"easyrepay.db" help:"database file"`
	SecretKeyString string `arg:"env:SECRET_KEY" help:"key to sign and verify JWTs"`
	InitUsername    string `arg:"env:INIT_USERNAME" default:"admin" help:"username of the first user"`
	InitPassword    string `arg:"env:INIT_PASSWORD" default:"admin" help:"password of the first user"`
	InitName        string `arg:"env:INIT_NAME" default:"Admin" help:"name of the first user"`
	Debug           bool   `arg:"env:DEBUG" help:"activate debug logs"`
}

func (args *ArgsType) SecretKey() []byte {
	if secretKey == nil {
		secret, err := base64.StdEncoding.DecodeString(args.SecretKeyString)
		FailOnError(err)
		secretKey = secret
	}
	return secretKey
}

var Args ArgsType
var secretKey []byte

func CheckSecretKey() {
	if Args.SecretKeyString == "" {
		log.Warn("Secret key not found, using randomly generated")
		secret := GenerateRandomBytes(256)
		Args.SecretKeyString = base64.StdEncoding.EncodeToString(secret)
	}
}
