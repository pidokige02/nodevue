/*
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : '192.168.25.26',
  user     : 'pidokige',
  password : 'Feb02pid~',
  database : 'testdb'
});

connection.connect();


connection.query('select * from Dept',  function (error, results, fields) {
  if (error) throw error;
  console.log('The First User is: ', results[0]);
  console.log('The Second User is: ', results[1]);
  console.log('The Third User is: ', results[2]);

  console.log('The First field is: ', fields[0]);
  console.log('The Second field is: ', fields[1]);
  console.log('The Third field is: ', fields[2]);

  //connection.query('delete ', (error) => {
    //if (error) throw error;
    //connection.end();
  //});
});

connection.end();
*/

const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host     : '192.168.25.26',
//   user     : 'pidokige',
//   password : 'Feb02pid~',
//   database : 'testdb'
// });

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'pidokige',
  password : 'Feb02pid~',
  database : 'testdb'
});

connection.connect();

// connection.query('select * from User', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The First User is: ', results[0]);
// });

// connection.query('select * from User where uid=?', ['user2'], function (error, results, fields) {
//   if (error) throw error;
//   console.log('The First User is: ', results[0]);
// });

// 각각의 query 가 독립 process 로 실행이 되기 때문에  아래래 같이 callback function 안에 위치시킨다.
// connection.query('update User set lastlogin=now() where uid=?', ['user2'], function (error, results, fields) {
//   if (error) throw error;
//   console.log('The Update: ', results);

//   connection.query('select * from User where uid=?', ['user2'], function (error, results, fields) {
//     if (error) throw error;
//     console.log('The First User is: ', results[0]);
//     connection.end();
//   });
// });


// 잘못 설계한 code 의 대표적인 sample ==> bluebird module 이 필요한 이유임
// 아래의 code 는 error발생시 connection.end 의 보장도 받지 못한다
connection.beginTransaction(err2 => {
  connection.query('update User set lastlogin=now() where uid=?', ['user2'], function (error, results, fields) {
    if (error) throw error;
    console.log('The Update', results.affectedRows);

    connection.query('select * from User where uid=?', ['user2'], function (error, results, fields) {
      if (error) throw error;
      console.log('The First User is: ', results[0]);

      connection.query('delete ', (error) => {
        if (error) throw error;
        connection.end();
      });
    });
  });
});
