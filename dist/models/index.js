"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

exports.default = async () => {
  let connected = false;
  let maxReconnects = 20;

  const Sequelize = require("sequelize");

  const Op = Sequelize.Op;

  const sequelize = new Sequelize("shoestore", "postgres", "postgres", {
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
    define: {
      underscored: true
    },
    operatorsAliases: {
      $or: Op.or
    }
  });

  while (!connected && maxReconnects) {
    try {
      await sequelize.authenticate();
      connected = true;
    } catch (err) {
      console.log("Reconnecting in 5 seconds");
      await sleep(5000);
      maxReconnects -= 1;
    }
  }
  if (!connected) {
    return null;
  }

  const models = {
    User: sequelize.import("./User"),
    Shoe: sequelize.import("./Shoe"),
    Like: sequelize.import("./Like"),
    Review: sequelize.import("./Review"),
    DirectMessage: sequelize.import("./DirectMessage"),
    Channel: sequelize.import("./Channel"),
    Cart: sequelize.import("./Cart")
  };

  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  return models;
};