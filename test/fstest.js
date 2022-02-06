const fs = require('fs'); // default 로 지원되는 것으로 별도의 installation 이 필요없다
const util = require('util');

console.log("aaaaaaaaaaaaa")          //  시간이 표시되지 않는 log
util.log("bbbbbbbbbbb", __dirname)    //  logging 시간이 표시되는 log  __dirname : 현재 directory

// 1
fs.readFile(__dirname + '/test.json', 'utf-8', (err, data) => {
        if (err) return console.error(err);

        util.log("data1 >>", data);
});

// 2
const msgfile = __dirname + '/message.txt';
fs.writeFileSync(msgfile, 'Hello Node.js 이순신!!', (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});

// 3
let data2 = fs.readFileSync(msgfile, 'utf-8');
util.log("data2>>", data2);

util.log("===================================", data2);

//1은 비동기 IO 이기 깨문에  // 2 //3 실행후 //1 에서 정의한 call back 이 실행된다.