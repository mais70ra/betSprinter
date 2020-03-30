'use strict';
var database = require('./db');
var session = require('../../core/session');
var CryptoJS = require('crypto-js');
var db;
var core;

module.exports = {
  init: (c) => {
    database.init()
    .then(r => {
      db = r;
    });
    core = c;
  },
  add: async function(msg, meta) {
    msg.password = CryptoJS.MD5(msg.password).toString();
    let resp = await db.create(msg);
    await core.call('account.create', {
      userId: resp.id,
      balance: 200
    });
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
    let account = await core.call('account.get', {}, meta);
    return {
      name: meta.data.firstName + ' ' + meta.data.lastName,
      balance: account[0].balance
    };
  },
  logout: async function(msg, meta) {
    session.delete(meta.jwtToken);
    return;
  },
};
