package main

import (
	"flag"
	"net/http"
	"os"
)

func main() {
	url := flag.String("url", "http://localhost:8080/api/health", "URL to check")
	flag.Parse()
	if _, err := http.Get(*url); err != nil {
		os.Exit(1)
	}
}
