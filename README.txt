METAR
A JSON web API that returns the latest weather info given a specific station code and used Redis database for optimizing API calls.

NOTE:-I used windows and installed npm and Redis 3.0.2 version for windows.

Requirements:
Nodejs
Expressjs
Redis 3.0.2(windows)
node-fetch

Setup:
$ npm install

Usage:
1. Type this command in cmd: $ npm start

2. Express server will run at: localhost:5000

3. Redis server will will be running on: 127.0.0.1:6379

4. Open http://localhost:5000/metar/ping for getting {"data":"pong"} response.

5. Open http://localhost:5000/metar/info?scode="type station code here"
   For example: http://localhost:5000/metar/info?scode=KSGS
   Here "KSGS" is station code.

6. Open http://localhost:5000/metar/info?scode=KSGS&nocache=1
   Passing nocache=1, if you want to fetch live data from METAR and also refresh the cache.	 