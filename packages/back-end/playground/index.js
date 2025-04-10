const Base64 = require('js-base64').Base64;
const params = {
  current: 1,
  pageSize: 10,
};

const code = Base64.encode(JSON.stringify(params));
console.log(code);
