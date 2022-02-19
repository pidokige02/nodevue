// connection pool을 singleton을 이용하여 관리해주는 class module
// dn 관리 connection pool 을 관리하는 code

const mysql   = require("mysql"),
      util    = require('util'),
      Promise = require("bluebird");

Promise.promisifyAll(mysql);  //별도 process 를 사용하는 module 을 then 을 사용하여 synchronous 한 logic 을 사용할 수 있다.
Promise.promisifyAll(require("mysql/lib/Connection").prototype);  // connection 을 promisify 함
Promise.promisifyAll(require("mysql/lib/Pool").prototype);  // Pool 을 promisify 함.


const DB_INFO = {
  // host     : '192.168.25.19',
  host     : 'localhost',
  user     : 'pidokige',
  password : 'Feb02pid~',
  database : 'testdb',
  multipleStatements: true,
  connectionLimit:5,
  waitForConnections:false
};


// A, B, C, D, E
// connection 시마다 0,5 초가 걸리는 것을 기존에 만든 것을 재사용하여 물리적인 network 비용을 줄일수 있다..

module.exports = class {
  constructor(dbinfo) {
    dbinfo = dbinfo || DB_INFO;
    this.pool = mysql.createPool(dbinfo);  // 5개 이상은 만들지 못하게 관리한다.
  }

  connect() {
    return this.pool.getConnectionAsync().disposer(conn => {  // connection 을 쓰는 process 가 종료가 되면 disposer가 실행이된다 (즉 connection 을 release 한다.)
    // return this.pool.getConnectionAsync().then().disposer(conn => { // then 을 사용할 수도 있다.
      return conn.release();  // 재사용해야 하기 때문에 close가 아니라 release 를 쓴다
    });
  }

  end() {  // 주로 application 에서 사용하고 serer 종료시에 호출해주면 된다.
    this.pool.end( function(err) {
      util.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> End of Pool!!");
      if (err)
        util.log("ERR pool ending!!");
    });
  }
};
