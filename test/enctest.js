const util = require('util');  // node js 가 기본적으로 제공하는 것
const utils = require('../utils'); // 새로 만든것.

let map = utils.makeMap('name', 'hong');
util.log("map>>>>>>>>", map.get('name'))

let str = "NodeJS";

let enc = utils.encrypt(str);
util.log("enc=", enc);
let dec = utils.decrypt(enc);
util.log("enc=", dec);

let shaEnc = utils.encryptSha2(str);
util.log("shaEnc=", shaEnc);

// 암호와 확인을 위하여 아래 command 를  mysql을 사용할 수 있다.  실제는 동작하지 않았음. mysql 8.0 에서
// select password("NodeJS", SHA2("NodeJS", 256),  SHA2(concat("NodeJS", "nodevue")), 256);
// select password("NodeJS");
