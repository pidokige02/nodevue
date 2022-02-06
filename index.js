//설문시스템 동작 방법 : node index.js 실행후  localhost:7000/apis/replies/265 를 실행한다.

const express = require('express'),  // include module
  app = express(),
  util = require('util'),
  bodyParser = require('body-parser');

const rest = require('./rest');

const Pool = require('./pool');     // myaql access module
const pool = new Pool();

const testJson = require('./test/test.json');

app.use(express.static('public'));  //To serve static files such as images, CSS files, and JavaScript files,
                                    //set the express.static built-in middleware function in express to declare

app.set('views', __dirname + '/views');   // __dirname + '/views directory 를 'views' 로 하겠다고 express 에 신고한다.
app.set('view engine', 'ejs');            // view engine 을 ejs를 쓰겠다고 express 신고하는 것임.
app.engine('html', require('ejs').renderFile);  // html 형식으로 ejs 를 쓰겠다.

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin); // allow  port accessible other than 8700
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

  if (req.method === 'OPTIONS') {  // server 가 정상인지 툭 던진다.
      res.status(200).end();

  } else {
      next();
  }
});

app.use(bodyParser.json({limit: '10mb'}));  // json 을 10MB로 걸어둔다.
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // 여러개의 json 이 와도 연결시키겎다.

rest(app, pool);


const server = app.listen(7000, function(){  // Starts a UNIX socket and listens for connections on the given path.
  console.log("Express's started on port 7000");
});

// io는 socket.io 패키지를 import한 변수
// webserver 와 chatting server 를 combine 하는 과정
const io = require('socket.io').listen(server, {  // io socket creation.
  log: false,
  origins: '*:*',     // URL 이 달라도 들어올수 있다. SPRING 강의시 언급
  pingInterval: 3000, // client가 살아있는지를 check 하는 주기  default : 25sec
  pingTimeout: 5000   // 응답이 없을시 기다리는 시간 client 가끊어져도 다시 붙게 할 수있다.  default : 60 sec
});

// localhost:7000/chat-client.html 와 같이 chatting server 로 connection 함
//socket은 커넥션이 성공했을 때 커넥션에 대한 정보를 담고 있는 변수
io.sockets.on('connection', (socket, opt) => {  // 가장 상위 socket 으로 connection 을 listening 한다.
  socket.emit('message', {msg: 'Welcome ' + socket.id});

  util.log("connection>>", socket.id, socket.handshake.query) //query 은

  socket.on('join', function(roomId, fn) {
    socket.join(roomId, function() { // socket이 room 으로 들어가게 된다.
      util.log("Join", roomId, Object.keys(socket.rooms)); // roomss
      if (fn)
        fn();
    });
  });

  socket.on('leave', function(roomId, fn) {  // client 에서 data 뿐만 아니라 fn 도 줄주 있다. 감동!
    util.log("leave>>", roomId, socket.id)
    socket.leave(roomId, function() {
      if (fn)
        fn();
    });
  });

  socket.on('rooms', function(fn) {
    if (fn)
      fn(Object.keys(socket.rooms));
  });

  // data: {room: 'roomid', msg: 'msg 내용..'}
  socket.on('message', (data, fn) => {
    util.log("message1>>", data)

    socket.broadcast.to(data.room).emit('message', {room: data.room, msg: data.msg});

    if (fn)
      fn(data.msg);
  });

  socket.on('message-for-one', (socketid, msg, fn) => {
    // socket.broadcast.to(socketid).emit('message', {msg: msg});
    socket.to(socketid).emit('message', {msg: msg});
  });

  socket.on('disconnecting', function(data) {  // 한사람이 browser 를 닫았다는 의미임
    util.log("disconnecting>>", socket.id, Object.keys(socket.rooms))
  });

  socket.on('disconnect', function(data) {
    util.log("disconnect>>", socket.id, Object.keys(socket.rooms))
  });

});
