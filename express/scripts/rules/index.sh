#!/bin/bash
# --include \
TOKEN='DTnJorCh0pTtNuh7GcUBIA=='

curl \
  --silent  \
  --request GET http://localhost:3000/rules \
  --header "Authorization: Token token=$TOKEN" \
