package utils

import (
	"crypto/rand"
)

func GenerateRandomBytes(n int) []byte {
	b := make([]byte, n)
	_, err := rand.Read(b)
	FailOnError(err)
	return b
}
