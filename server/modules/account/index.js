"use strict";
const database = require("./db");
const { Sequelize } = require('sequelize');
var session = require('../../core/session');
const log = require('../../logger').log;
var db;
module.exports = {
  init: () => {
    database.init()
    .then(r => {
      db = r;
    });
  },
  create: async function(msg, meta) {
    let resp = await db.create(msg);
    return Promise.resolve(resp);
  },
  get: async function(msg, meta) {
    return await db.findAll({
      where: {
        userId: meta.data.id
      }
    });
  },
  update: async function(msg, meta) {
    return Promise.resolve();
  }
};
