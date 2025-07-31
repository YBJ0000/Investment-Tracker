# Investment-Tracker

launch node.js backend:
add package.json for setup and dependencies
add server.js as the main backend server
add .gitignore to prevent node_modules, .env... files from uploading
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
