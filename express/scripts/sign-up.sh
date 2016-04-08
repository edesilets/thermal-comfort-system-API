#!/bin/bash
# --include \

curl \
  --silent  \
  --request POST http://homestatus.ddns.net:3000/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "jake@statefarm.com",
      "password": "password",
      "password_confirmation": "password"
    }
  }'
#
# curl --include --request POST http://localhost:3000/sign-up \
#   --header "Content-Type: application/json" \
#   --data '{
#     "credentials": {
#       "email": "jake@statefarm.com",
#       "password": "password",
#       "password_confirmation": "password"
#     }
#   }'
