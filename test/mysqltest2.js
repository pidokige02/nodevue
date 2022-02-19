const util    = require('util'),
      Promise = require("bluebird");

const Pool = require('../pool');
const pool = new Pool();              // class 이므로 new 를 해야 pool 을 만든다.

const sql1 = "update User set lastlogin=now() where uid='user1'";
const sql2 = "update User set lastlogin=now() where uid='user2'";

// // 5th  tried sample codes in lesson2
// execute( conn => { // calling function defined just below
//   Promise.all([
//     conn.queryAsync(sql1),
//     conn.queryAsync(sql2)

//   ]).then( r => {
//     for (let i = 0; i < r.length; i++)
//       util.log(`sql${i+1}=`, r[i].affectedRows);
//     conn.commit();
//     pool.end();

//   }).catch( e => {
//     conn.rollback();
//     pool.end();
//   });
// });

// function execute(fn) {   // promise 와 using 을 한군데서 호촐하기 위해 함수화 시킴 ==> mydb 로 module 로 분리시킬 수 있다.
//   Promise.using( pool.connect(), conn => {
//     conn.beginTransaction( txerr => {

//       fn(conn);

//     });
//   });
// }


// // 4th  tried sample codes in lesson2
Promise.using( pool.connect(), conn => {  //
  conn.beginTransaction( txerr => {       // in order to secure tranaction at the same time.
                                          // txerr 은 beginTransaction 시 발생한 error 임
    Promise.all([
      conn.queryAsync(sql1),
      conn.queryAsync(sql2)

    ]).then( r => {
      for (let i = 0; i < r.length; i++)
        util.log(`sql${i+1}=`, r[i].affectedRows);
      conn.commit();
      pool.end();

    }).catch( e => {
      conn.rollback();
      pool.end();
    });

  });
});


// 3rd  tried sample codes in lesson2  // 2개를 같이 실행할 경우
// Promise.using( pool.connect(), conn => {
//   Promise.all([ // Promise.all은 parallel로 아래 command 를 실행하고 then 의 r 의 function 을 실행한다.

//     conn.queryAsync(sql1),
//     conn.queryAsync(sql2)   // tranaction 보장이 않될 수 있다.

//   ]).then( r => { // 결과는 위의 query 갯수만큼 array 로 온다.
//     util.log("End of Then!!!!!!!!!!!!!!!!!!!");
//     util.log("sql1=", r[0].affectedRows);
//     util.log("sql2=", r[1].affectedRows);
//     pool.end();

//   }).catch( err => {
//     util.log("EERRRRRRRRRRRR")
//     poll.end();
//   });
// });


// 2nd tried sample codes in lesson2
// Promise.using( pool.connect(), conn => {    //1st sample 구문 대신에 then 을 사용함
//   conn.queryAsync(sql1)
//       .then(console.log)                    // 결과가 console.log 로 넘어간다.
//       .catch( err => {
//         util.log("err>>", err);
//       });

//   pool.end();
// });



// 1st tried sample codes in lesson2
// Promise.using( pool.connect(), conn => {  // 구문이 복잡하다.
//   conn.queryAsync(sql1, (err, ret) => {
//     util.log("sql1=", ret.affectedRows);

//     // conn.queryAsync(sql2, (err2, ret2) => {
//     //   util.log("sql2=", ret2.affectedRows);
//     // });
//   });

//   pool.end(); // >>>>>>>>>>>>>>>>>>>>>>>>>>> End of Pool!! 까지 타게 된다.
//  });