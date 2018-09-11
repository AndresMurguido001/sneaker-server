export default (sequelize, DataTypes) => {
  let Review = sequelize.define("review", {
    message: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Must provide a review"
        }
      }
    }
  });

  Review.associate = models => {
    Review.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
    Review.belongsTo(models.Shoe, {
      foreignKey: {
        name: "shoeId",
        field: "shoe_id"
      }
    });
  };

  return Review;
};
