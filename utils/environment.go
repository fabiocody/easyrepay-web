package utils

import (
	"encoding/base64"
	log "github.com/sirupsen/logrus"
	"os"
)

var env *Environment

type Environment struct {
	DatabaseUrl  string
	SecretKey    []byte
	InitUsername string
	InitPassword string
	InitName     string
}

func Env() *Environment {
	if env == nil {
		env = &Environment{
			DatabaseUrl:  getEnv("DATABASE_URL"),
			SecretKey:    loadSecretKey(),
			InitUsername: getEnvOrDefault("INIT_USERNAME", "admin"),
			InitPassword: getEnvOrDefault("INIT_PASSWORD", "admin"),
			InitName:     getEnvOrDefault("INIT_NAME", "Admin"),
		}
	}
	return env
}

func getEnv(key string) string {
	v, found := os.LookupEnv(key)
	if !found {
		FailOnError(ErrEnvNotFound{Key: key})
	}
	return v
}

func getEnvOrDefault(key string, defaultValue string) string {
	v, found := os.LookupEnv(key)
	if found {
		return v
	} else {
		log.Warnf("Environment variable %s not found, using default value", key)
		return defaultValue
	}
}

func loadSecretKey() []byte {
	var secret []byte
	secretB64 := os.Getenv("SECRET_KEY")
	if secretB64 == "" {
		log.Warn("Environment variable SECRET_KEY not found, using randomly generated key")
		secret = GenerateRandomBytes(256)
	} else {
		var err error
		secret, err = base64.StdEncoding.DecodeString(secretB64)
		FailOnError(err)
	}
	secretB64 = base64.StdEncoding.EncodeToString(secret)
	log.Debugf("Using secret %s", secretB64)
	return secret
}
