#!/bin/bash
TOKEN='gjLyXo3/W0G9/FnK4CdQAw=='
ID=1
curl --include --request PATCH http://localhost:3000/change-password/$ID \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "password",
      "new": "password"
    }
  }'
