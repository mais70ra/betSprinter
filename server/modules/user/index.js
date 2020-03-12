'use strict';
var database = require('./db');
var session = require('../../core/session');
var CryptoJS = require('crypto-js');
var db;

module.exports = {
  init: () => {
    database.init()
    .then(r => {
      db = r;
    });
  },
  add: async function(msg, meta) {
    msg.password = CryptoJS.MD5(msg.password).toString();
    let resp = await db.create(msg);
    delete resp.password;
    return resp;
  },
  edit: (msg, meta)=> {
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
  },
  login: async function(msg, meta) {
    if (!msg.username || !msg.password) {
      throw new Error('Please enter username and password!')
    } else {
      msg.password = CryptoJS.MD5(msg.password).toString();
      const resp = await db.findAll({
        where: {
          password: msg.password,
          username: msg.username
        }
      });
      if (resp.length === 0) {
        throw new Error('Wrong username or password');
      }
      return resp[0];
    }
  },
  check: async function(msg, meta) {
    return;
  },
  logout: async function(msg, meta) {
    session.delete(meta.jwtToken);
    return;
  },
};
