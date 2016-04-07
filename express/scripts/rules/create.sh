#!/bin/bash
# --include \
TOKEN='DsacymqWFS24I5tCDEQTnw=='

curl \
  --silent  \
  --request POST http://localhost:3000/rules \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "rule": {
      "name": "untangible",
      "temperature": "777.23",
      "operator": "operatorTEST",
      "action": "actionTest",
      "active": "T"
    }
  }'
