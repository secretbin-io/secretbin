#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

mkdir -p $SCRIPT_DIR/tls

openssl genrsa -out $SCRIPT_DIR/tls/ca.key 4096

openssl req -x509 -new -nodes -key $SCRIPT_DIR/tls/ca.key -sha256 -days 36500 -out $SCRIPT_DIR/tls/ca.crt \
    -subj "/C=US/ST=California/L=San Francisco/O=PostgreSQL/OU=IT/CN=PostgreSQL Root CA"

openssl genrsa -out $SCRIPT_DIR/tls/server.key 4096
openssl req -new -key $SCRIPT_DIR/tls/server.key -out $SCRIPT_DIR/tls/server.csr \
    -subj "/C=US/ST=California/L=San Francisco/O=PostgreSQL/CN=postgres"

openssl x509 -req -in $SCRIPT_DIR/tls/server.csr -CA $SCRIPT_DIR/tls/ca.crt -CAkey $SCRIPT_DIR/tls/ca.key -CAcreateserial \
    -out $SCRIPT_DIR/tls/server.crt -days 36500 -sha256 \
    -extfile <(printf "subjectAltName=DNS:localhost,DNS:postgres,IP:127.0.0.1")

rm $SCRIPT_DIR/tls/server.csr $SCRIPT_DIR/tls/ca.srl
