"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (sequelize, DataTypes) => {
  const Review = sequelize.define("review", {
    message: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Must provide a review"
        },
        len: {
          args: [1, 300],
          msg: "Review must be between 1 and 300 characters"
        }
      }
    },
    starRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
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