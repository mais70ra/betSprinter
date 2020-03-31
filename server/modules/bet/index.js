"use strict";
const database = require("./db");
const { Sequelize } = require("sequelize");
var session = require("../../core/session");
const wssc = require("../../webSocketServer/wssConnections");
const log = require("../../logger").log;
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
var core;
module.exports = {
  init: c => {
    database.init().then(r => {
      db = r;
    });
    core = c;
  },
  startBet: async function(msg, meta) {
    return resp;
  },
  setBets: async function(msg, meta) {
    let account = await core.call("account.get", {}, meta);
    if (!account[0]) {
      throw new Error("Account not found!");
    }
    if (account[0].balance - msg.amount <= 0) {
      throw new Error("Insufficient balance!");
    }
    try {
      await db.update(
        {
          chosenPlayer: msg.playerNumber,
          chosenAmount: msg.amount
        },
        {
          where: {
            id: msg.betId,
            userId: meta.data.id
          }
        }
      );
      await account[0].update({
        balance: account[0].balance - msg.amount
      });
    } catch (e) {
      throw new Error("Bet was not accepted, please try with the next game!");
    }
    return Promise.resolve({
      success: true
    });
  },
  check: async function(msg, meta) {
    return;
  },
  subscribeEvent: async function(msg, meta) {
    let resp = await db.findAll({
      where: {
        userId: meta.data.id,
        status: {
          [Sequelize.Op.not]: "closed"
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
        bettingTime: config.gameDuration.bettingTime,
        id: betObject.id
      });
      setTimeout(async function() {
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
        }, (config.gameDuration.game +
          config.gameDuration.winningAnimation +
          config.gameDuration.idleTime) *
          1000);
        betObject = await betObject.reload();
        betObject.status = "active";
        betObject.winner = getWinners();
        sendMessage("active", {
          winner: betObject.winner,
          status: betObject.status,
          id: betObject.id,
          isUserWin: betObject.winner[betObject.chosenPlayer - 1] === config.playerNumbers,
          amount: betObject.winner[betObject.chosenPlayer - 1] === config.playerNumbers ? betObject.chosenAmount : 0,
          gameDuration: {
            game: config.gameDuration.game,
            winningAnimation: config.gameDuration.winningAnimation,
            idleTime: config.gameDuration.winningAnimation
          }
        });
        if (betObject.winner[betObject.chosenPlayer - 1] === config.playerNumbers) {
          let account = await core.call("account.get", {}, meta);
          await account[0].update({
            balance: account[0].balance + betObject.chosenAmount * 2
          });
        }
        betObject.winner = JSON.stringify(betObject.winner);
        await betObject.save();
      }, config.gameDuration.bettingTime * 1000);
    }
    if (resp.length === 0) {
      startGame();
    } else {
      var response;
      if (resp[0].status === "pending") {
        response = {
          status: resp[0].status,
          id: resp[0].id,
          bettingTime: parseFloat(
            config.gameDuration.bettingTime -
              (Date.now() - resp[0].startDateTime) / 1000
          ).toFixed(2)
        };
      } else {
        response = {
          winner: JSON.parse(resp[0].winner),
          status: resp[0].status,
          id: resp[0].id,
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
    return;
  }
};

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
  return [1, 2, 3, 4, 8, 6, 7, 5];
  return shuffle(players);
}
