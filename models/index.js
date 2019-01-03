'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const Op = Sequelize.Op;

const sequelize = new Sequelize("shoestore", "postgres", "postgres", {
  dialect: "postgres",
  host: "localhost",
  define: {
    underscored: true
  },
  operatorsAliases: {
    $or: Op.or
  }
});

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
	  console.log("MODEL NAME: ", modelName);
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
