M = $(shell printf "\033[34;1m▶\033[0m")

#MODULE 		= $(shell env GO111MODULE=on go list -m)
#GIT_BRANCH 	= $(shell git rev-parse --abbrev-ref HEAD)
#GIT_COMMIT	= $(shell git rev-parse --short HEAD)
#BUILD_DATE	= $(shell date '+%Y-%m-%d_%H:%M:%S')
#LDFLAGS 	+= -X "$(MODULE)/release_info.GitBranch=$(GIT_BRANCH)" -X "$(MODULE)/release_info.GitCommit=$(GIT_COMMIT)" -X "$(MODULE)/release_info.BuildDate=$(BUILD_DATE)"

ifeq ($(shell uname), Linux)
	LDFLAGS += -extldflags=-static
endif

.PHONY: all
all: build

.PHONY: build
build: | frontend backend healthcheck ; $(info $(M) Done)

.PHONY: frontend
frontend: | ; $(info $(M) Building frontend...)
	cd angular && npm ci && npm run build

.PHONY: backend
backend: | ; $(info $(M) Building backend...)
	go mod download && go build -ldflags '$(LDFLAGS)' -tags=nomsgpack -o . ./cmd/easyrepay.go

.PHONY: healthcheck
healthcheck: | ; $(info $(M) Building healthcheck...)
	go mod download && go build -ldflags '$(LDFLAGS)' -o . ./cmd/healthcheck.go

.PHONY: clean
clean: | ; $(info $(M) Cleaning...)
	rm -rf angular/dist
	rm -rf easyrepay
	rm -rf healthcheck
