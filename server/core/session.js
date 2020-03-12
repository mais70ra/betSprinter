var jwt = require("jsonwebtoken");
var cert = require("../config").jwt.cert;
var blackListTokens = {};
module.exports = {
  add: async function(value) {
    try {
      let token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: value
        },
        cert
      );
      return Promise.resolve(token);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  verify: async function(token) {
    return new Promise(function(resolve, reject) {
      try {
        if (blackListTokens[token]) {
          throw new Error('Invalid session');
        }
        jwt.verify(
          token,
          cert,
          function(err, payload) {
            if (!err) {
              resolve(payload);
            }
            throw err;
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  },
  delete: async function(token) {
    blackListTokens[token] = true;;
  }
};
