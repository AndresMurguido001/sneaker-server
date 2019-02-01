"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (sequelize, DataTypes) => {
  const Cart = sequelize.define("cart", {
    total: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    }
  });
  Cart.associate = models => {
    Cart.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
  };
  return Cart;
};