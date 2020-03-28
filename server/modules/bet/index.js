"use strict";
const database = require("./db");
const { Sequelize } = require('sequelize');
var session = require('../../core/session');
const wssc = require('../../webSocketServer/wssConnections');
const log = require('../../logger').log;
var db;
var config = {
  gameDuration: {
    bettingTime: 30,
    winningAnimation: 5,
    idleTime: 5,
    game: 30
  },
  playerNumbers: 8
};

module.exports = {
  init: () => {
    database.init()
    .then(r => {
      db = r;
    });
  },
  startBet: async function(msg, meta) {
    return resp;
  },
  edit: (msg, meta) => {},
  get: msg => {
    return;
  },
  check: async function(msg, meta) {
    return;
  },
  subscribeEvent: async function(msg, meta) {
    let resp = await db.findAll({
      where: {
        userId: meta.data.id,
        status: {
          [Sequelize.Op.not]: 'closed'
        }
      }
    });
    async function startGame() {
      var betObject = {
        userId: meta.data.id,
        status: "pending",
        startDateTime: Date.now(),
        bettingTime: config.gameDuration.bettingTime
      };
      var betObject = await db.create(betObject);
      sendMessage("pending", {
        status: betObject.status,
        bettingTime: config.gameDuration.bettingTime
      });
      setTimeout(async function() {
        betObject.status = "active";
        betObject.winner = getWinners();
        sendMessage("active", {
          winner: betObject.winner,
          status: betObject.status,
          gameDuration: {
            game: config.gameDuration.game,
            winningAnimation: config.gameDuration.winningAnimation,
            idleTime: config.gameDuration.winningAnimation
          }
        });
        betObject.winner = JSON.stringify(betObject.winner);
        await betObject.save();
        setTimeout(async function() {
          betObject.status = "closed";
          betObject.endtDateTime = Date.now();
          await betObject.save(); 
          try {
            if (session.verify(meta.jwtToken)) {
              startGame();
            }
          } catch (e) {
            // session expired - stop the loop
            log.error(e);
          }
        }, (config.gameDuration.game + config.gameDuration.winningAnimation + config.gameDuration.idleTime) * 1000);
      }, config.gameDuration.bettingTime * 1000);
    }
    if (resp.length === 0) {
      startGame();
    } else {
      var response;
      if (resp[0].status === 'pending') {
        response = {
          status: resp[0].status,
          bettingTime: parseFloat(config.gameDuration.bettingTime - ((Date.now() - resp[0].startDateTime) / 1000)).toFixed(2)
        };
      } else {
        response = {
          winner: JSON.parse(resp[0].winner),
          status: resp[0].status,
          gameDuration: {
            game: config.gameDuration.game,
            winningAnimation: config.gameDuration.winningAnimation,
            idleTime: config.gameDuration.winningAnimation
          }
        };
      }
      sendMessage(resp[0].status, response);
    }
    function sendMessage(event, params) {
      wssc.sendMessage(meta.jwtToken, {
        event: event,
        params: params
      });
    }
    return ;
  }
};

let totalTime =
  config.gameDuration.bettingTime +
  config.gameDuration.winningAnimation +
  config.gameDuration.idleTime +
  config.gameDuration.game;
var players = [];
for (var n = 1; n < config.playerNumbers + 1; n++) {
  players.push(n);
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWinners() {
  return shuffle(players);
}
