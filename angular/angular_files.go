//go:build !dev
// +build !dev

package angular

import (
	"embed"
	"github.com/fabiocody/easyrepay/utils"
	"io/fs"
	"net/http"
)

const Status = "UP"

//go:embed dist/*
var dist embed.FS

func Files() http.FileSystem {
	dist, err := fs.Sub(dist, "dist")
	utils.FailOnError(err)
	return http.FS(dist)
}
