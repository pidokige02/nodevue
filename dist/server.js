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

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("//설문시스템 동작 방법 : node index.js 실행후  localhost:7000/apis/replies/265 를 실행한다.\n\nconst express = __webpack_require__(/*! express */ \"express\"),  // include module\n  app = express(),\n  util = __webpack_require__(/*! util */ \"util\"),\n  bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nconst rest = __webpack_require__(/*! ./rest */ \"./rest.js\");\n\nconst Pool = __webpack_require__(/*! ./pool */ \"./pool.js\");     // myaql access module\nconst pool = new Pool();\n\nconst testJson = __webpack_require__(/*! ./test/test.json */ \"./test/test.json\");\n\napp.use(express.static('public'));  //To serve static files such as images, CSS files, and JavaScript files,\n                                    //set the express.static built-in middleware function in express to declare\n\napp.set('views', __dirname + '/views');   // __dirname + '/views directory 를 'views' 로 하겠다고 express 에 신고한다.\napp.set('view engine', 'ejs');            // view engine 을 ejs를 쓰겠다고 express 신고하는 것임.\napp.engine('html', (__webpack_require__(/*! ejs */ \"ejs\").renderFile));  // html 형식으로 ejs 를 쓰겠다.\n\napp.use( (req, res, next) => {\n  res.header(\"Access-Control-Allow-Origin\", req.headers.origin); // allow  port accessible other than 8700\n  res.header(\"Access-Control-Allow-Credentials\", \"true\");\n  res.header(\"Access-Control-Allow-Headers\", \"X-Requested-With\");\n  res.header(\"Access-Control-Allow-Headers\", \"Content-Type, Authorization\");\n  res.header(\"Access-Control-Allow-Methods\", \"PUT, GET, POST, DELETE, OPTIONS\");\n\n  if (req.method === 'OPTIONS') {  // server 가 정상인지 툭 던진다.\n      res.status(200).end();\n\n  } else {\n      next();\n  }\n});\n\napp.use(bodyParser.json({limit: '10mb'}));  // json 을 10MB로 걸어둔다.\napp.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // 여러개의 json 이 와도 연결시키겎다.\n\nrest(app, pool);\n\n\nconst server = app.listen(7000, function(){  // Starts a UNIX socket and listens for connections on the given path.\n  console.log(\"Express's started on port 7000\");\n});\n\n// io는 socket.io 패키지를 import한 변수\n// webserver 와 chatting server 를 combine 하는 과정\nconst io = (__webpack_require__(/*! socket.io */ \"socket.io\").listen)(server, {  // io socket creation.\n  log: false,\n  origins: '*:*',     // URL 이 달라도 들어올수 있다. SPRING 강의시 언급\n  pingInterval: 3000, // client가 살아있는지를 check 하는 주기  default : 25sec\n  pingTimeout: 5000   // 응답이 없을시 기다리는 시간 client 가끊어져도 다시 붙게 할 수있다.  default : 60 sec\n});\n\n// localhost:7000/chat-client.html 와 같이 chatting server 로 connection 함\n//socket은 커넥션이 성공했을 때 커넥션에 대한 정보를 담고 있는 변수\nio.sockets.on('connection', (socket, opt) => {  // 가장 상위 socket 으로 connection 을 listening 한다.\n  socket.emit('message', {msg: 'Welcome ' + socket.id});\n\n  util.log(\"connection>>\", socket.id, socket.handshake.query) //query 은\n\n  socket.on('join', function(roomId, fn) {\n    socket.join(roomId, function() { // socket이 room 으로 들어가게 된다.\n      util.log(\"Join\", roomId, Object.keys(socket.rooms)); // roomss\n      if (fn)\n        fn();\n    });\n  });\n\n  socket.on('leave', function(roomId, fn) {  // client 에서 data 뿐만 아니라 fn 도 줄주 있다. 감동!\n    util.log(\"leave>>\", roomId, socket.id)\n    socket.leave(roomId, function() {\n      if (fn)\n        fn();\n    });\n  });\n\n  socket.on('rooms', function(fn) {\n    if (fn)\n      fn(Object.keys(socket.rooms));\n  });\n\n  // data: {room: 'roomid', msg: 'msg 내용..'}\n  socket.on('message', (data, fn) => {\n    util.log(\"message1>>\", data)\n\n    socket.broadcast.to(data.room).emit('message', {room: data.room, msg: data.msg});\n\n    if (fn)\n      fn(data.msg);\n  });\n\n  socket.on('message-for-one', (socketid, msg, fn) => {\n    // socket.broadcast.to(socketid).emit('message', {msg: msg});\n    socket.to(socketid).emit('message', {msg: msg});\n  });\n\n  socket.on('disconnecting', function(data) {  // 한사람이 browser 를 닫았다는 의미임\n    util.log(\"disconnecting>>\", socket.id, Object.keys(socket.rooms))\n  });\n\n  socket.on('disconnect', function(data) {\n    util.log(\"disconnect>>\", socket.id, Object.keys(socket.rooms))\n  });\n\n});\n\n\n//# sourceURL=webpack://nodevue/./index.js?");

/***/ }),

/***/ "./mydb.js":
/*!*****************!*\
  !*** ./mydb.js ***!
  \*****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Promise = __webpack_require__(/*! bluebird */ \"bluebird\");\n\nmodule.exports = class {\n  constructor(pool) {     // class new 할 때 index.js 여기서는 indexejs.js 에서 pool 을 넘겨준다.\n    this.pool = pool;\n  }\n\n  execute(fn) {\n    Promise.using( this.pool.connect(), conn => {\n      fn(conn);\n    });\n  }\n\n  executeTx(fn) {\n    Promise.using( this.pool.connect(), conn => {\n      conn.beginTransaction( txerr => {\n        fn(conn);\n      });\n    });\n  }\n};\n\n//# sourceURL=webpack://nodevue/./mydb.js?");

/***/ }),

/***/ "./pool.js":
/*!*****************!*\
  !*** ./pool.js ***!
  \*****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// connection pool을 singleton을 이용하여 관리해주는 class module\n// dn 관리 connection pool 을 관리하는 code\n\nconst mysql   = __webpack_require__(/*! mysql */ \"mysql\"),\n      util    = __webpack_require__(/*! util */ \"util\"),\n      Promise = __webpack_require__(/*! bluebird */ \"bluebird\");\n\nPromise.promisifyAll(mysql);  //별도 process 를 사용하는 module 을 then 을 사용하여 synchronous 한 logic 을 사용할 수 있다.\nPromise.promisifyAll((__webpack_require__(/*! mysql/lib/Connection */ \"mysql/lib/Connection\").prototype));  // connection 을 promisify 함\nPromise.promisifyAll((__webpack_require__(/*! mysql/lib/Pool */ \"mysql/lib/Pool\").prototype));  // Pool 을 promisify 함.\n\n\nconst DB_INFO = {\n  // host     : '192.168.25.19',\n  host     : 'localhost',\n  user     : 'pidokige',\n  password : 'Feb02pid~',\n  database : 'testdb',\n  multipleStatements: true,\n  connectionLimit:5,\n  waitForConnections:false\n};\n\n\n// A, B, C, D, E\n// connection 시마다 0,5 초가 걸리는 것을 기존에 만든 것을 재사용하여 물리적인 network 비용을 줄일수 있다..\n\nmodule.exports = class {\n  constructor(dbinfo) {\n    dbinfo = dbinfo || DB_INFO;\n    this.pool = mysql.createPool(dbinfo);  // 5개 이상은 만들지 못하게 관리한다.\n  }\n\n  connect() {\n    return this.pool.getConnectionAsync().disposer(conn => {  // connection 을 쓰는 process 가 종료가 되면 disposer가 실행이된다 (즉 connection 을 release 한다.)\n    // return this.pool.getConnectionAsync().then().disposer(conn => { // then 을 사용할 수도 있다.\n      return conn.release();  // 재사용해야 하기 때문에 close가 아니라 release 를 쓴다\n    });\n  }\n\n  end() {  // 주로 application 에서 사용하고 serer 종료시에 호출해주면 된다.\n    this.pool.end( function(err) {\n      util.log(\">>>>>>>>>>>>>>>>>>>>>>>>>>> End of Pool!!\");\n      if (err)\n        util.log(\"ERR pool ending!!\");\n    });\n  }\n};\n\n\n//# sourceURL=webpack://nodevue/./pool.js?");

/***/ }),

/***/ "./rest.js":
/*!*****************!*\
  !*** ./rest.js ***!
  \*****************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Mydb = __webpack_require__(/*! ./mydb */ \"./mydb.js\");\n\nmodule.exports = function(app, pool) {  // class 는 아니고 utility 성 function 을 모아 둔것임\n  \n  app.post(('/apis/adminkey'), (req, res) => {\n    let key = req.body.key;\n    if (key == '1212' || key == 'surveykey!!!') {\n      res.status(200).json({});\n    } else {\n      res.status(403).json({});\n    }\n  });\n\n  // survey\n  app.get(('/apis/surveys'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 \n    let mydb = new Mydb(pool);\n    mydb.execute( conn => {\n      conn.query(\"select * from Survey limit 1000\", (err, ret) => {\n        res.json(ret);\n      });\n    });\n  });                    \n  \n  app.get(('/apis/surveys/:id'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 \n    let id = req.params.id;\n    let mydb = new Mydb(pool);\n    mydb.execute( conn => {\n      conn.query(\"select * from Survey where id = ?\", [id], (err, ret) => {\n        if (err) throw err;\n        res.json(ret[0]);  // 하나만 나갈것임\n      });\n    });\n  });                    \n  \n  app.put(('/apis/surveys/:id'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 \n    let id = req.params.id,\n        title = req.body.title,\n        state = req.body.state;\n    let mydb = new Mydb(pool);\n    mydb.executeTx( conn => {\n      conn.query(\"update Suvey set title=?, state=? where id = ?\",[title, state, id], (err, ret) => {\n        res.json(ret.affectedRows);\n      });\n    });\n  });                    \n\n  // 등록하는 부분\n  app.post(('/apis/surveys'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 \n    let title = req.body.title;\n  \n    let mydb = new Mydb(pool);\n    mydb.executeTx( conn => {\n      conn.query(\"insert into Survey(title, state) value(?, 0)\",[title], (err, ret) => {\n        if(err) throw err;\n        res.json(ret.affectedRows);\n      });\n    });\n  });                    \n\n\n  // chrome 에서 localhost:7000 을 실행하면 Hello NodeJS!! 이 화면에 나타남. \n  app.get(('/'), (req, res) => {  // root 에서 요청이 오면 arrow function 안의 내용으로 반응한다.\n    //res.send(\"Hello NodeJS!!\");  \n    //res.json(testJson);  //Sends a JSON response.\n    res.render('index', {name: '홍길동'});  //홍길동이 index.ejs안의 name 에 mapping 되어 출력이된다.\n  });\n\n  app.get(('/test/:email'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 \n    testJson.email = req.params.email;       // {\"id\":123,\"name\":\"hong kil dong\",\"email\":\"aaa@ddd.com\"} 와 같이 출력된다\n    testJson.aa = req.query.aa;              // localhost:7000/test/aaa@ddd.com?aa=123 와 같이 request 하면 \n                                              // {\"id\":123,\"name\":\"hong kil dong\",\"email\":\"aaa@ddd.com\",\"aa\":\"123\"} 와 같이 출력된다.\n    res.json(testJson);  //Sends a JSON response.\n  });                    // cf. req.body, req.query     \n\n  app.get('/apis/replies/:bno', (req, res) => {  // localhost:7000/apis/replies/265 과 같이 request를 하면\n    let bno = req.params.bno;\n    let mydb = new Mydb(pool);\n    mydb.execute( conn => {\n      conn.query(\"select * from Reply where bno=? limit 10\", [bno], (err, ret) => {\n        res.json(ret);\n      });\n    });\n  });\n\n  app.get('/apis/replies/:bno/:rno', (req, res) => {\n    let bno = req.params.bno,\n        rno = req.params.rno;\n\n    let mydb = new Mydb(pool);\n    mydb.execute( conn => {\n      conn.query(\"select * from Reply where rno=?\", [rno], (err, ret) => {\n        res.json(ret[0]);\n      });\n    });\n  });\n\n  app.put('/apis/replies/:bno/:rno', (req, res) => {\n    let bno = req.params.bno,\n        rno = req.params.rno,\n        replytext = req.body.replytext;\n\n    let mydb = new Mydb(pool);\n    mydb.executeTx( conn => {\n      conn.query(\"update Reply set replytext = ? where rno = ?\", [replytext, rno], (err, ret) => {\n        if (err) {\n          conn.rollback();\n          throw err;\n        }\n\n        res.json(ret.affectedRows);\n        conn.commit();\n      });\n    });\n  });\n\n  app.get(('/dbtest/:user'), (req, res) => {  // localhost:7000/dbtest/user1 과 같이 request를 하면\n    let user = req.params.user;\n    let mydb = new Mydb(pool);  // 위에서 만든 pool을 Mydb 로 넘긴다.\n    mydb.execute( conn => {\n      conn.query(\"select * from User where uid=?\", [user], (err, ret) => {  // user 는 params 에서 넘어온 것임\n        res.json(ret);\n      });\n    });\n  });  \n};\n\n//# sourceURL=webpack://nodevue/./rest.js?");

/***/ }),

/***/ "bluebird":
/*!***************************!*\
  !*** external "bluebird" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("bluebird");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");

/***/ }),

/***/ "ejs":
/*!**********************!*\
  !*** external "ejs" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("ejs");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("mysql");

/***/ }),

/***/ "mysql/lib/Connection":
/*!***************************************!*\
  !*** external "mysql/lib/Connection" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("mysql/lib/Connection");

/***/ }),

/***/ "mysql/lib/Pool":
/*!*********************************!*\
  !*** external "mysql/lib/Pool" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("mysql/lib/Pool");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("socket.io");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "./test/test.json":
/*!************************!*\
  !*** ./test/test.json ***!
  \************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"id\":123,\"name\":\"hong kil dong\"}');\n\n//# sourceURL=webpack://nodevue/./test/test.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;