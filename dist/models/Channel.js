"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (sequelize, DataTypes) => {
  const Channel = sequelize.define("channel", {});

  Channel.associate = models => {
    Channel.belongsTo(models.User, {
      foreignKey: {
        name: "receiverId",
        field: "receiver_id"
      }
    });
    Channel.belongsTo(models.User, {
      foreignKey: {
        name: "senderId",
        field: "sender_id"
      }
    });
  };

  return Channel;
};