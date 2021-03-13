const util = require('util');       // node js 가 기본적으로 제공하는 것
const utils = require('../utils');  // 새로 만든것.

let url = "https://naver.com";

utils.ogsinfo(url, (err, ret) => {
  util.log(err, ret);
});

// utils 의 ogsinfo 의 입력인자 fn 에 위 함수 전체를 넘긴다.