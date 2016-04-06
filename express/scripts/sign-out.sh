#!/bin/bash
TOKEN='49t2SenAXiWSy8m4cDKNcA=='
ID='1'

curl \
--silent \
--request DELETE http://localhost:3000/sign-out/${ID} \
--header "Authorization: Token token=${TOKEN}"
