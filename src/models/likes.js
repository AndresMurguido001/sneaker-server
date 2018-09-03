export default (sequelize, DataTypes) => {
  let Like = sequelize.define("likes");
  Like.associate = models => {
    Like.belongsTo(models.User, {
      as: "user",
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
    Like.belongsTo(models.Shoe, {
      as: "shoe",
      foreignKey: {
        name: "shoeId",
        field: "shoe_id"
      }
    });
  };
  return Like;
};
// , {
//   as: "user",
//   foreignKey: {
//     name: "userId",
//     field: "user_id",
//   }
// }
// , {
//   as: "shoe",
//   foreignKey: {
//     name: "shoeId",
//     field: "shoe_id"
//   }
// }
