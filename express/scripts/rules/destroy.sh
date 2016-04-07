#!/bin/bash
TOKEN='DsacymqWFS24I5tCDEQTnw=='

echo 'Enter ID to delete for route'
read ID
curl \
--silent \
--request DELETE http://localhost:3000/rules/${ID} \
--header "Authorization: Token token=${TOKEN}"
