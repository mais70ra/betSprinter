'use strict';
var database = require('./db');
var CryptoJS = require('crypto-js');
var db;

module.exports = {
  init: () => {
    database.init()
    .then(r => {
      db = r;
    });
  },
  add: async function(msg) {
    msg.password = CryptoJS.MD5(msg.password).toString();
    let resp = await db.create(msg);
    delete resp.password;
    return resp;
  },
  edit: msg => {
    return {
      status: 0
    };
  },
  get: msg => {
    return [
      {
        firstName: "Dido",
        lastName: "E pich"
      }
    ];
  }
};
