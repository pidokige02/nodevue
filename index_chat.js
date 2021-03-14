// 실행방법 node indexejf.js 실행 후 chrome 에서 localhost:7000 을 실행한다. 
// ejg 와 db access test codes 임

const express = require('express'),  // include module
  app = express(),
  util = require('util');

const Pool = require('./pool'),     // myaql access module
      Mydb = require('./mydb');

const testJson = require('./test/test.json');

const pool = new Pool();

app.use(express.static('public'));  //To serve static files such as images, CSS files, and JavaScript files, 
                                    //ㅕse the express.static built-in middleware function in express to declare 

app.set('views', __dirname + '/views');   // __dirname + '/views directory 를 'views' 로 하겠다고 express 에 신고한다.
app.set('view engine', 'ejs');            // view engine 을 ejs를 쓰겠다고 express 신고하는 것임.
app.engine('html', require('ejs').renderFile);  // html 형식으로 ejs 를 쓰겠다.

// chrome 에서 localhost:7000 을 실행하면 Hello NodeJS!! 이 화면에 나타남. 
app.get(('/'), (req, res) => {  // root 에서 요청이 오면 arrow function 안의 내용으로 반응한다.
  //res.send("Hello NodeJS!!");  
  //res.json(testJson);  //Sends a JSON response.
   res.render('index', {name: '홍길동'});  //홍길동이 index.ejs안의 name 에 mapping 되어 출력이된다.
});

app.get(('/test/:email'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 
   testJson.email = req.params.email;       // {"id":123,"name":"hong kil dong","email":"aaa@ddd.com"} 와 같이 출력된다
   testJson.aa = req.query.aa;              // localhost:7000/test/aaa@ddd.com?aa=123 와 같이 request 하면 
                                            // {"id":123,"name":"hong kil dong","email":"aaa@ddd.com","aa":"123"} 와 같이 출력된다.
   res.json(testJson);  //Sends a JSON response.
});

app.get(('/dbtest/:user'), (req, res) => {  // localhost:7000/dbtest/user1 과 같이 request를 하면
  let user = req.params.user;
  let mydb = new Mydb(pool);  // 위에서 만든 pool을 Mydb 로 넘긴다.
  mydb.execute( conn => {
    conn.query("select * from User where uid=?", [user], (err, ret) => {  // user 는 params 에서 넘어온 것임
      res.json(ret);
    });
  });
});


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
