#!/bin/bash
# --include \
TOKEN='DTnJorCh0pTtNuh7GcUBIA=='
echo 'whats the id to fetch?'
read ID
curl \
  --silent  \
  --request GET http://localhost:3000/rules/${ID} \
  --header "Authorization: Token token=${TOKEN}" \
| jsonlint
