export default (sequelize, DataTypes) => {
  const Like = sequelize.define("like");
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
}
