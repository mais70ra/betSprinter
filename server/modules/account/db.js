const { Sequelize, DataTypes } = require('sequelize');
var config = require("../../config");
Sequelize.Validator.notNull = function(item) {
  return !this.isNull(item);
};


module.exports = {
  init: async function() {
    var database = new Sequelize(
      config.database.name,
      config.database.credentials.username,
      config.database.credentials.password,
      config.database.props
    );
    var db = database.define(
      "Account",
      {
        userId: {
          type: DataTypes.INTEGER
        },
        balance: {
          type: DataTypes.INTEGER
        }
      }
    );
    await database.sync({ alter: true });
    return db;
  }
};
