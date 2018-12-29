import Sequelize from "sequelize";

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
  User: sequelize.import("./user"),
  Shoe: sequelize.import("./shoe"),
  Like: sequelize.import("./likes"),
  Review: sequelize.import("./review"),
  DirectMessage: sequelize.import("./directMessage"),
  Channel: sequelize.import("./channel"),
  Cart: sequelize.import("./cart")
};
Object.keys(models).forEach(name => {
  if (models[name].associate) {
    models[name].associate(models);
  }
});
models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
