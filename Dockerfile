# builder
FROM golang:1.18 AS builder
COPY go.mod /src/
COPY go.sum /src/
RUN cd /src && go mod download
COPY . /src/
RUN cd /src && go build -ldflags '-linkmode "external" --extldflags "-static"' cmd/ipasd/ipasd.go

# runtime
FROM alpine:3.10.3
LABEL maintainer="hautvfami@gmail.com"
WORKDIR /app
COPY --from=builder /src/ipasd /app
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT /docker-entrypoint.sh
