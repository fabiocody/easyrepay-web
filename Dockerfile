# syntax=docker/dockerfile:1

## BUILD FRONTEND
FROM node:14 AS build_fe
COPY Makefile ./Makefile
COPY angular ./angular
RUN make frontend

## BUILD BACKEND
FROM golang:1.17 AS build_be
WORKDIR /app
RUN mkdir /data
RUN mkdir ./angular
COPY go.mod go.sum ./
RUN go mod download
COPY Makefile ./
COPY cmd ./cmd
RUN make healthcheck
COPY utils ./utils
COPY model ./model
COPY controllers ./controllers
COPY services ./services
COPY --from=build_fe angular/*.go ./angular/
COPY --from=build_fe angular/dist ./angular/dist
RUN make backend

## Deploy
FROM gcr.io/distroless/static AS final
WORKDIR /
COPY --from=build_be /data /data
COPY --from=build_be /app/easyrepay /easyrepay
COPY --from=build_be /app/healthcheck /healthcheck
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=2s --start-period=3s --retries=3 CMD ["/healthcheck"]
ENTRYPOINT ["/easyrepay"]
