# Investment-Tracker

launch node.js backend:
add package.json for setup and dependencies
 (can also by set up by `npm init -y`, 
  and add `"start": "node server.js"` to package.json
  and then `npm i express`)
add server.js as the main backend server
add .gitignore to prevent node_modules, .env... files from uploading
run `git init` to init git for version control
run `npm i` to install dependencies
run `npm start` to start the server
try `curl http://localhost:3000/api/investments` to get info from server

add db.json
modify server.js: 
(GET method)
read data from db.json
note: must parse json string javascript object before response

modify server.js: 
(POST method)
read current data
create new data (generate id and conbine request body)
push new data to the end of current data array
write into db.json
return http status and created data

api test guide in backend/API_TESTS.md

modify server.js:
(DELETE method)
read current data
find index of target investment
investment not exist, return 404
delete investment using splice()
write into db.json
return http status and deleted data
(PUT method)
just combine the traits of both POST and DELETE

install jsonwebtoken and bcrypt

modify server.js:
import jwt and bcrypt
add auth middleware
new feature: login and registration
add auth middleware (authenticateToken) to every route about investments as the second parameter

create .env
install dotenv

modify server.js:
import dotenv
change how PORT and JWT_JWT_SECRET init
add userId to POST /api/investments
add filter to GET /api/investments, only return current user info
change sync to async
