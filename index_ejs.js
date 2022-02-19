// 실행방법 node index_ejs.js 실행 후 chrome 에서 localhost:7000 을 실행한다.
// ejg 와 db access test codes 임

const express = require('express'),   // include module node js 에서 사용하는 websesrver
  app = express();                    // init express, not run express

const Pool = require('./pool'),     // myaql access module
      Mydb = require('./mydb');

const testJson = require('./test/test.json');

const pool = new Pool();

app.use(express.static('public'));  //To serve static files such as images, CSS files, and JavaScript files,
                                    //use the express.static built-in middleware function in express to declare

app.set('views', __dirname + '/views');   // __dirname + '/views directory 를 'views' 로 하겠다고 express 에 신고한다.
app.set('view engine', 'ejs');            // view engine 을 ejs를 쓰겠다고 express 신고하는 것임.
app.engine('html', require('ejs').renderFile);  // html 형식으로 ejs 를 쓰겠다.

// chrome 에서 localhost:7000 을 실행하면 Hello NodeJS!! 이 화면에 나타남.
app.get(('/'), (req, res) => {  // root 에서 요청이 오면 arrow function 안의 내용으로 반응한다.
  //res.send("Hello NodeJS!!");
  //res.json(testJson);  //Sends a JSON response.
   res.render('index', {name: '홍길동'});  //홍길동이 index.ejs안의 name 에 mapping 되어 출력이된다.
});

//:email 은 URI 에서 변수값을 가지고 온다.
app.get(('/test/:email'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면
   testJson.email = req.params.email;       // {"id":123,"name":"hong kil dong","email":"aaa@ddd.com"} 와 같이 "email" 이 추가되어 출력된다
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
