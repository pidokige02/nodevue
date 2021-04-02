/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./mydb.js":
/*!*****************!*\
  !*** ./mydb.js ***!
  \*****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Promise = __webpack_require__(/*! bluebird */ \"bluebird\");\n\nmodule.exports = class {\n  constructor(pool) {\n    this.pool = pool;\n  }\n\n  execute(fn) {\n    Promise.using( this.pool.connect(), conn => {\n      fn(conn);\n    });\n  }\n\n  executeTx(fn) {\n    Promise.using( this.pool.connect(), conn => {\n      conn.beginTransaction( txerr => {\n        fn(conn);\n      });\n    });\n  }\n};\n\n//# sourceURL=webpack://nodevue/./mydb.js?");

/***/ }),

/***/ "./pool.js":
/*!*****************!*\
  !*** ./pool.js ***!
  \*****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// connection pool을 singleton을 이용하여 관리해주는 class module\n\nconst mysql   = __webpack_require__(/*! mysql */ \"mysql\"),\n      util    = __webpack_require__(/*! util */ \"util\"),\n      Promise = __webpack_require__(/*! bluebird */ \"bluebird\");\n\nPromise.promisifyAll(mysql);  //별도 process 를 사용하는 module 을 then 을 사용하여 synchronous 한 logic 을 사용할 수 있다.\nPromise.promisifyAll(__webpack_require__(/*! mysql/lib/Connection */ \"mysql/lib/Connection\").prototype);\nPromise.promisifyAll(__webpack_require__(/*! mysql/lib/Pool */ \"mysql/lib/Pool\").prototype);\n\n\nconst DB_INFO = {\n  host     : '192.168.25.11',\n  user     : 'pidokige',\n  password : 'Feb02pid~',\n  database : 'testdb',\n  multipleStatements: true,\n  connectionLimit:5,\n  waitForConnections:false\n};\n\n/*\nconst DB_INFO = {\n  host     : '115.71.233.22',\n  user     : 'testuser',\n  password : 'testuser!@#',\n  database : 'testdb',\n  multipleStatements: true,\n  connectionLimit:5,\n  waitForConnections:false\n};\n*/\n\n// A, B, C, D, E \n// connection 시마다 0,5 초가 걸리는 것을 기존에 만든 것을 재사용하여 물리적인 network 비용을 줄일수 있다..\n\nmodule.exports = class {\n  constructor(dbinfo) {\n    dbinfo = dbinfo || DB_INFO;\n    this.pool = mysql.createPool(dbinfo);  // 5개 이상은 만들지 못하게 관리한다.\n  }\n\n  connect() {\n    return this.pool.getConnectionAsync().disposer(conn => {  // connection 을 쓰는 process 가 종료가 되면 disposer가 실행이된다 (즉 connection 을 release 한다.)\n    // return this.pool.getConnectionAsync().then().disposer(conn => { // then 을 사용할 수도 있다.\n      return conn.release();  // 재사용해야 하기 때문에 close가 아니라 release 를 쓴다\n    });\n  }\n\n  end() {\n    this.pool.end( function(err) {\n      util.log(\">>>>>>>>>>>>>>>>>>>>>>>>>>> End of Pool!!\");\n      if (err)\n        util.log(\"ERR pool ending!!\");\n    });\n  }\n};\n\n\n\n\n//# sourceURL=webpack://nodevue/./pool.js?");

/***/ }),

/***/ "./rest.js":
/*!*****************!*\
  !*** ./rest.js ***!
  \*****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Mydb = __webpack_require__(/*! ./mydb */ \"./mydb.js\");\n\nmodule.exports = function(app, pool) {\n  app.get('/test/:email', (req, res) => {\n    testJson.email = req.params.email;  // cf. req.body, req.query\n    testJson.aa = req.query.aa;\n    res.json(testJson);\n  });\n\n  app.get('/apis/replies/:bno', (req, res) => {\n    let bno = req.params.bno;\n    let mydb = new Mydb(pool);\n    mydb.execute( conn => {\n      conn.query(\"select * from Reply where bno=? limit 10\", [bno], (err, ret) => {\n        res.json(ret);\n      });\n    });\n  });\n\n  app.get('/apis/replies/:bno/:rno', (req, res) => {\n    let bno = req.params.bno,\n        rno = req.params.rno;\n\n    let mydb = new Mydb(pool);\n    mydb.execute( conn => {\n      conn.query(\"select * from Reply where rno=?\", [rno], (err, ret) => {\n        res.json(ret[0]);\n      });\n    });\n  });\n\n  app.put('/apis/replies/:bno/:rno', (req, res) => {\n    let bno = req.params.bno,\n        rno = req.params.rno,\n        replytext = req.body.replytext;\n\n    let mydb = new Mydb(pool);\n    mydb.executeTx( conn => {\n      conn.query(\"update Reply set replytext = ? where rno = ?\", [replytext, rno], (err, ret) => {\n        if (err) {\n          conn.rollback();\n          throw err;\n        }\n\n        res.json(ret.affectedRows);\n        conn.commit();\n      });\n    });\n  });\n\n  app.get('/dbtest/:user', (req, res) => {\n    let user = req.params.user;\n    let mydb = new Mydb(pool);\n    mydb.execute( conn => {\n      conn.query(\"select * from User where uid=?\", [user], (err, ret) => {\n        res.json(ret);\n      });\n    });\n  });\n};\n\n//# sourceURL=webpack://nodevue/./rest.js?");

/***/ }),

/***/ "./test/test.json":
/*!************************!*\
  !*** ./test/test.json ***!
  \************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse(\"{\\\"id\\\":123,\\\"name\\\":\\\"hong kil dong\\\"}\");\n\n//# sourceURL=webpack://nodevue/./test/test.json?");

/***/ }),

/***/ "bluebird":
/*!***************************!*\
  !*** external "bluebird" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("bluebird");;

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");;

/***/ }),

/***/ "ejs":
/*!**********************!*\
  !*** external "ejs" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("ejs");;

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");;

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("mysql");;

/***/ }),

/***/ "mysql/lib/Connection":
/*!***************************************!*\
  !*** external "mysql/lib/Connection" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("mysql/lib/Connection");;

/***/ }),

/***/ "mysql/lib/Pool":
/*!*********************************!*\
  !*** external "mysql/lib/Pool" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("mysql/lib/Pool");;

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("socket.io");;

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
eval("/*\nconst express = require('express');  // include module\nconst app = express(),\n  testJson = require('./test/test.json');\n\napp.use(express.static('public'));  //To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express\n\napp.get(('/'), (req, res) => {\n  // res.send(\"Hello NodeJS!!\");\n  //res.json(testJson);  //Sends a JSON response.\n  res.render('index', {name: '홍길동'}); //홍길동이 index.ejs안의 name 에 mapping 되어 출력이된다.\n});\n\napp.get(('/test/:email'), (req, res) => {   // localhost/test/aaa@ddd.com 과 같이 request를 하면 \n   testJson.email = req.params.email;       // {\"id\":123,\"name\":\"hong kil dong\",\"email\":\"aaa@ddd.com\"} 와 같이 출력된다\n   testJson.aa = req.query.aa;              // localhost/test/aaa@ddd.com?aa=123 와 같이 request 하면 \n                                            // {\"id\":123,\"name\":\"hong kil dong\",\"email\":\"aaa@ddd.com\",\"aa\":\"123\"} 와 같이 출력된다.\n   res.json(testJson);  //Sends a JSON response.\n});\n\n\napp.set('views', __dirname + '/views');  // express 에 신고한다.\napp.set('view engine', 'ejs');\napp.engine('html', require('ejs').renderFile);  // html 형식으로 ejs 를 쓰겠다.\n\nconst server = app.listen(7000, function(){  // Starts a UNIX socket and listens for connections on the given path.\n  console.log(\"Express's started on port 7000\");\n});\n*/\n\n\n\nconst express = __webpack_require__(/*! express */ \"express\"),  // include module\n      app = express(),\n      util = __webpack_require__(/*! util */ \"util\"),\n      bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nconst rest = __webpack_require__(/*! ./rest */ \"./rest.js\");\n\nconst Pool = __webpack_require__(/*! ./pool */ \"./pool.js\");\nconst pool = new Pool();\n\nconst testJson = __webpack_require__(/*! ./test/test.json */ \"./test/test.json\");\n      \napp.use(express.static('public'));  // To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express\n//images, CSS files, and JavaScript files 을 public directory 아래에 두지만 client 에서 public path 을 붙이지 않아도 access 가 가능하게 함. \n\napp.set('views', __dirname + '/views');  // express 에 신고한다.\napp.set('view engine', 'ejs');\napp.engine('html', __webpack_require__(/*! ejs */ \"ejs\").renderFile);  // html 형식으로 ejs 를 쓰겠다.\n\napp.use( (req, res, next) => {\n  res.header(\"Access-Control-Allow-Origin\", req.headers.origin);\n  res.header(\"Access-Control-Allow-Credentials\", \"true\");\n  res.header(\"Access-Control-Allow-Headers\", \"X-Requested-With\");\n  res.header(\"Access-Control-Allow-Headers\", \"Content-Type, Authorization\");\n  res.header(\"Access-Control-Allow-Methods\", \"PUT, GET, POST, DELETE, OPTIONS\");\n\n  if (req.method === 'OPTIONS') {\n      res.status(200).end();\n      \n  } else {\n      next();\n  }\n});\n\napp.use(bodyParser.json({limit: '10mb'}));\napp.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));\n\nrest(app, pool);\n\nconst server = app.listen(7000, function(){\n    console.log(\"Express's started on port 7000\");\n});\n\n// io는 socket.io 패키지를 import한 변수\n// webserver 와 chatting server 를 combine 하는 과정\nconst io = __webpack_require__(/*! socket.io */ \"socket.io\").listen(server, {\n  log: false,\n  origins: '*:*',     // URL 이 달라도 들어올수 있다. SPRING 강의시 언급\n  pingInterval: 3000, // client가 살아있는지를 check 하는 주기\n  pingTimeout: 5000   // 응답이 없을시 기다리는 시간 client 가끊어져도 다시 붙게 할 수있다.\n});\n\n//////////////////////////////////////////////////////////////\n/*\nio.sockets.on('connection', (socket, opt) => {  // 가장 상위 socket\n  socket.emit('message', {msg: 'Welcome ' + socket.id});\n\n  util.log(\"connection>>\", socket.id, socket.handshake.query)\n\n  socket.on('join', function(roomId, fn) {\n    socket.join(roomId, function() {  // socket이 room 으로 들어가게 된다. join 이 되면 callback fn 이 호출된다\n      util.log(\"Join\", roomId, Object.keys(socket.rooms)); // json 형태이고 roomid를 array 형태로 얻어온다. \n      if (fn)\n        fn();\n    });\n  });\n\n  socket.on('leave', function(roomId, fn) { // fn 은 client 에서 주는 함수임. 감동적인 기능이라고 함.\n    util.log(\"leave>>\", roomId, socket.id)\n    socket.leave(roomId, function() {\n      if (fn)\n        fn();\n    });\n  });\n\n  socket.on('rooms', function(fn) {\n    if (fn)\n      fn(Object.keys(socket.rooms));\n  });\n\n  // data: {room: 'roomid', msg: 'msg 내용..'}\n  socket.on('message', (data, fn) => {\n    util.log(\"message>>\", data.msg, Object.keys(socket.rooms));\n    if (fn)\n      fn(data.msg);\n  });\n\n  socket.on('disconnecting', function(data) {\n    util.log(\"disconnecting>>\", socket.id, Object.keys(socket.rooms))\n  });\n\n  socket.on('disconnect', function(data) {\n    util.log(\"disconnect>>\", socket.id, Object.keys(socket.rooms))\n  });\n\n});\n///////////////////////////////////////////////////////////////\n*/\n\n\n//socket은 커넥션이 성공했을 때 커넥션에 대한 정보를 담고 있는 변수\nio.sockets.on('connection', (socket, opt) => {  // 가장 상위 socket\n  socket.emit('message', {msg: 'Welcome ' + socket.id});\n\n  util.log(\"connection>>\", socket.id, socket.handshake.query)\n\n  socket.on('join', function(roomId, fn) {\n    socket.join(roomId, function() { // socket이 room 으로 들어가게 된다.\n      util.log(\"Join\", roomId, Object.keys(socket.rooms));\n      if (fn)\n        fn();\n    });\n  });\n\n  socket.on('leave', function(roomId, fn) {\n    util.log(\"leave>>\", roomId, socket.id)\n    socket.leave(roomId, function() {\n      if (fn)\n        fn();\n    });\n  });\n\n  socket.on('rooms', function(fn) {\n    if (fn)\n      fn(Object.keys(socket.rooms));\n  });\n\n  // data: {room: 'roomid', msg: 'msg 내용..'}\n  socket.on('message', (data, fn) => {\n    util.log(\"message1>>\", data)\n\n    socket.broadcast.to(data.room).emit('message', {room: data.room, msg: data.msg});\n\n    if (fn)\n      fn(data.msg);\n  });\n\n  socket.on('message-for-one', (socketid, msg, fn) => {\n    // socket.broadcast.to(socketid).emit('message', {msg: msg});\n    socket.to(socketid).emit('message', {msg: msg});\n  });\n\n  socket.on('disconnecting', function(data) {\n    util.log(\"disconnecting>>\", socket.id, Object.keys(socket.rooms))\n  });\n\n  socket.on('disconnect', function(data) {\n    util.log(\"disconnect>>\", socket.id, Object.keys(socket.rooms))\n  });\n\n});\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://nodevue/./index.js?");
})();

/******/ })()
;