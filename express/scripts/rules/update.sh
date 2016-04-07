#!/bin/bash
TOKEN='DTnJorCh0pTtNuh4GcUBIA=='

echo 'Enter ID to delete for route'
read ID
curl \
--silent \
--request PATCH http://localhost:3000/rules/${ID} \
--header "Authorization: Token token=${TOKEN}" \
--header "Content-Type: application/json" \
--data '{
  "rule": {
    "name": "TANGIBLE",
    "temperature": "183.23",
    "operator": "OPERATORTEST",
    "action": "ACTIONTest",
    "active": "F"
  }
}'
