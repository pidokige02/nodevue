const Promise = require('bluebird');

module.exports = class {
  constructor(pool) {     // class new 할 때 index.js 여기서는 indexejs.js 에서 pool 을 넘겨준다.
    this.pool = pool;
  }

  execute(fn) {
    Promise.using( this.pool.connect(), conn => {
      fn(conn);
    });
  }

  executeTx(fn) {
    Promise.using( this.pool.connect(), conn => {
      conn.beginTransaction( txerr => {
        fn(conn);
      });
    });
  }
};