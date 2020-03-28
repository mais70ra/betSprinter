const { Sequelize, DataTypes } = require('sequelize');
var config = require("../../config");
Sequelize.Validator.notNull = function(item) {
  return !this.isNull(item);
};

// userId: meta.data.id,
// status: "pending",
// startDateTime: Date.now()
// betObject.winner
// endtDateTime

module.exports = {
  init: async function() {
    var database = new Sequelize(
      config.database.name,
      config.database.credentials.username,
      config.database.credentials.password,
      config.database.props
    );
    var db = database.define(
      "Bet",
      {
        // Model attributes are defined here
        startDateTime: {
          type: DataTypes.BIGINT
        },
        endtDateTime: {
          type: DataTypes.BIGINT
        },
        userId: {
          type: DataTypes.INTEGER
        },
        winner: {
          type: DataTypes.STRING
        },
        chosenPlayer: {
          type: DataTypes.SMALLINT
        },
        chosenAmount: {
          type: DataTypes.SMALLINT
        },
        status: {
          type: DataTypes.STRING
        }
      }
    );
    await database.sync({ alter: true });
    return db;
  }
};
