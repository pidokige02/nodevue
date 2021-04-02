const Mydb = require('./mydb');

module.exports = function(app, pool) {  // class 는 아니고 utility 성 function 을 모아 둔것임
  
  app.post(('/apis/adminkey'), (req, res) => {
    let key = req.body.key;
    if (key == '1212' || key == 'surveykey!!!') {
      res.status(200).json({});
    } else {
      res.status(403).json({});
    }
  });

  // survey
  app.get(('/apis/surveys'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 
    let mydb = new Mydb(pool);
    mydb.execute( conn => {
      conn.query("select * from Survey limit 1000", (err, ret) => {
        res.json(ret);
      });
    });
  });                    
  
  app.get(('/apis/surveys/:id'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 
    let id = req.params.id;
    let mydb = new Mydb(pool);
    mydb.execute( conn => {
      conn.query("select * from Survey where id = ?", [id], (err, ret) => {
        if (err) throw err;
        res.json(ret[0]);  // 하나만 나갈것임
      });
    });
  });                    
  
  app.put(('/apis/surveys/:id'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 
    let id = req.params.id,
        title = req.body.title,
        state = req.body.state;
    let mydb = new Mydb(pool);
    mydb.executeTx( conn => {
      conn.query("update Suvey set title=?, state=? where id = ?",[title, state, id], (err, ret) => {
        res.json(ret.affectedRows);
      });
    });
  });                    

  // 등록하는 부분
  app.post(('/apis/surveys'), (req, res) => {   // localhost:7000/test/aaa@ddd.com 과 같이 request를 하면 
    let title = req.body.title;
  
    let mydb = new Mydb(pool);
    mydb.executeTx( conn => {
      conn.query("insert into Survey(title, state) value(?, 0)",[title], (err, ret) => {
        if(err) throw err;
        res.json(ret.affectedRows);
      });
    });
  });                    


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
  });                    // cf. req.body, req.query     

  app.get('/apis/replies/:bno', (req, res) => {  // localhost:7000/apis/replies/265 과 같이 request를 하면
    let bno = req.params.bno;
    let mydb = new Mydb(pool);
    mydb.execute( conn => {
      conn.query("select * from Reply where bno=? limit 10", [bno], (err, ret) => {
        res.json(ret);
      });
    });
  });

  app.get('/apis/replies/:bno/:rno', (req, res) => {
    let bno = req.params.bno,
        rno = req.params.rno;

    let mydb = new Mydb(pool);
    mydb.execute( conn => {
      conn.query("select * from Reply where rno=?", [rno], (err, ret) => {
        res.json(ret[0]);
      });
    });
  });

  app.put('/apis/replies/:bno/:rno', (req, res) => {
    let bno = req.params.bno,
        rno = req.params.rno,
        replytext = req.body.replytext;

    let mydb = new Mydb(pool);
    mydb.executeTx( conn => {
      conn.query("update Reply set replytext = ? where rno = ?", [replytext, rno], (err, ret) => {
        if (err) {
          conn.rollback();
          throw err;
        }

        res.json(ret.affectedRows);
        conn.commit();
      });
    });
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
};