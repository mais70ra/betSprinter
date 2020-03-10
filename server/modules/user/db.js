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
      "User",
      {
        // Model attributes are defined here
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [2, 25],
            notNull: {
              msg: "Firstname should be between 2 and 25 symbols long."
            }
          }
        },
        lastName: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        username: {
          type: DataTypes.STRING,
          typeParams: [25],
          unique: true,
          allowNull: false,
          validate: {
            len: [2, 25],
            notNull: {
              msg: "Username should be between 2 and 25 symbols long."
            }
          }
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        defaultScope: {
          attributes: { exclude: ["password"] }
        }
      }
    );
    await database.sync({ alter: true });
    return db;
  }
};
