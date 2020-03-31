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
  playerNumbers: 8,
  coefficient: 8
};
var core;
module.exports = {
  init: async function(c) {
    database.init().then(async function(r) {
      db = r;
      core = c;
      forceGameClosed();
    });
  },
  startBet: async function(msg, meta) {
    return resp;
  },
  setBets: async function(msg, meta) {
    if ([1, 5, 10, 20].indexOf(msg.amount) === -1) {
      throw new Error("Invalid amount!");
    }
    if ([1, 2, 3, 4, 5, 6, 7, 8].indexOf(msg.playerNumber) === -1) {
      throw new Error("Invalid player!");
    }
    let account = await core.call("account.get", {}, meta);
    if (!account[0]) {
      throw new Error("Account not found!");
    }
    if (account[0].balance - msg.amount <= 0) {
      throw new Error("Insufficient balance!");
    }
    let bet = await db.findAll({
      where: {
        id: msg.betId,
        userId: meta.data.id
      }
    });
    if (bet && bet[0] && bet[0].chosenPlayer) {
      throw new Error("Your bet was already accepted, you can not bet twice!");
    } else if (!bet[0]) {
      throw new Error("Your bet was not accepted, please contact ths support!");
    }
    await bet[0].update({
      chosenPlayer: msg.playerNumber,
      chosenAmount: msg.amount
    });
    await account[0].update({
      balance: account[0].balance - msg.amount
    });
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

    async function gameClosed(betObject) {
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
    }

    async function gameActive(betObject) {
      setTimeout(async function() {
        gameClosed(betObject);
        betObject = await betObject.reload();
        betObject.status = "active";
        betObject.winner = getWinners();
        try {
          await sendMessage("active", {
            winner: betObject.winner,
            status: betObject.status,
            id: betObject.id,
            isUserWin:
              betObject.winner[betObject.chosenPlayer - 1] ===
              config.playerNumbers,
            amount:
              betObject.winner[betObject.chosenPlayer - 1] ===
              config.playerNumbers
                ? betObject.chosenAmount * config.coefficient
                : 0,
            gameDuration: {
              game: config.gameDuration.game,
              winningAnimation: config.gameDuration.winningAnimation,
              idleTime: config.gameDuration.winningAnimation
            }
          });
        } catch (e) {
          // session was expired
          forceGameClosed();
        }
        if (
          betObject.winner[betObject.chosenPlayer - 1] === config.playerNumbers
        ) {
          let account = await core.call("account.get", {}, meta);
          await account[0].update({
            balance:
              account[0].balance + betObject.chosenAmount * config.coefficient
          });
        }
        betObject.winner = JSON.stringify(betObject.winner);
        await betObject.save();
      }, config.gameDuration.bettingTime * 1000);
    }

    async function startGame() {
      var betObject = {
        userId: meta.data.id,
        status: "pending",
        startDateTime: Date.now(),
        bettingTime: config.gameDuration.bettingTime
      };
      var betObject = await db.create(betObject);
      await sendMessage("pending", {
        status: betObject.status,
        bettingTime: config.gameDuration.bettingTime,
        id: betObject.id
      });
      gameActive(betObject);
    }

    if (resp.length === 0) {
      startGame();
    } else {
      var response;
      if (resp[0].status === "pending") {
        response = {
          status: resp[0].status,
          id: resp[0].id,
          chosenAmount: resp[0].chosenAmount,
          chosenPlayer: resp[0].chosenPlayer,
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
          gameDuration: {}
        };
        response.gameDuration.game =
          config.gameDuration.game +
          config.gameDuration.bettingTime -
          (Date.now() - resp[0].startDateTime) / 1000;
        if (response.gameDuration.game < 0) {
          response.gameDuration.winningAnimation =
            config.gameDuration.winningAnimation - response.gameDuration.game;
        } else {
          response.gameDuration.winningAnimation =
            config.gameDuration.winningAnimation;
        }
        if (response.gameDuration.winningAnimation < 0) {
          response.gameDuration.idleTime =
            config.gameDuration.idleTime -
            response.gameDuration.winningAnimation;
        } else {
          response.gameDuration.idleTime = config.gameDuration.idleTime;
        }
      }
      await sendMessage(resp[0].status, response);
    }
    function sendMessage(event, params) {
      return wssc.sendMessage(meta.jwtToken, {
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
  // return [1, 2, 3, 4, 8, 6, 7, 5];
  return shuffle(players);
}

async function forceGameClosed(id) {
  let where = {
    status: {
      [Sequelize.Op.not]: "closed"
    }
  };
  if (id) {
    where.id = id;
  }
  let allBets = await db.findAll({
    where: where
  });
  allBets.forEach(async function(bet) {
    if (bet.status === "pending" && bet.chosenAmount) {
      let account = await core.call(
        "account.get",
        {},
        {
          data: {
            id: bet.userId
          }
        }
      );
      await account[0].update({
        balance: account[0].balance + bet.chosenAmount
      });
    }
    await bet.update({
      status: "closed"
    });
  });
}
