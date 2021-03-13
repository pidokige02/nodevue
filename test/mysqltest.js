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

const connection = mysql.createConnection({
  host     : '192.168.25.26',
  user     : 'pidokige',
  password : 'Feb02pid~',
  database : 'testdb'
});
 
connection.connect();

// 잘못 설계한 code 의 대표적인 sample ==> bluebird module 이 필요한 이유임
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



