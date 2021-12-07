//go:build dev
// +build dev

package angular

import (
	"net/http"
	"os"
)

const Status = "DOWN"

var dist = os.DirFS("dist")

func Files() http.FileSystem {
	return http.FS(dist)
}
