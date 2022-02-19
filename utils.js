const ogs = require('open-graph-scraper'),  //
      HashMap = require('hashmap'),         // 대문자로 시작한 것은 Class
      Crypto = require('crypto-js'),        // 암호와 modeule
      SHA256 = ("crypto-js/sha256");        // MY-sql 에서 password 방식대신 SHA256 방식으로 접금함

const EKey = "nodevue";  //

// module.exports = class { 와 같이 하면 class 를 mdoule화 시킬수 있음  new 방식으로 사용가능하고
// thread safe 한 code 작성을 위해 필요함.
module.exports = {  // 괄호 사이가 export 가됨

  makeMap(key, value) {
    const map = new HashMap();
    map.set(key, value);
    console.log("TTT>>", map.get(key))
    return map;
  },  // json 방식으로 ,가 필요하다.

  encryptSha2(data, key) {  // 단방행 암호화는 decypt 가 없다. 아레 function이 예외적인 것도 고려된 잘 설계된것임
    if (!data) return null;
    key = key || EKey; // key가 없으면 EKey을 사용해라.

    try {  // serve 를 죽이지 않게 하기 위해 try catch 처리를 반드시 한다.

      return Crypto.SHA256(data + key).toString();

    } catch (err) {
      console.error("Error on encryptSha2::", err);
    }
  },

  encrypt(data, key) {  // AES : 양방행 암호화, SHA : 단방향 암호화
    return Crypto.AES.encrypt(data, key || EKey).toString();  // key로 암호와 key가 들어오지 않을 경우에 EKey을 사용함.
  },

  decrypt(data, key) {
    return Crypto.AES.decrypt(data, key || EKey).toString(Crypto.enc.Utf8);  // Crypto.enc.Utf8 이 없으면 출력이 깨진다
  },

  ogsinfo(url, fn) {
    return ogs({url: url}, (err, ret) => {
      fn(err, ret);
    });
  }

};