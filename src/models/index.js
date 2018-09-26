import Sequelize from "sequelize";

let sequelize = new Sequelize("shoestore", "postgres", "postgres", {
  dialect: "postgres",
  host: "localhost",
  define: {
    underscored: true
  }
});

const models = {
  User: sequelize.import("./user"),
  Shoe: sequelize.import("./shoe"),
  Like: sequelize.import("./likes"),
  Review: sequelize.import("./review"),
  DirectMessage: sequelize.import("./directMessage"),
  Channel: sequelize.import("./channel")
};
Object.keys(models).forEach(name => {
  if (models[name].associate) {
    models[name].associate(models);
  }
});
models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.op = Sequelize.Op;

export default models;
