export default (sequelize, DataTypes) => {
  let DirectMessage = sequelize.define("direct_message", {
    text: DataTypes.STRING
  });

  DirectMessage.associate = models => {
    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
    DirectMessage.belongsTo(models.Channel, {
      foreignKey: {
        name: "channelId",
        field: "channel_id"
      }
    });
  };

  return DirectMessage;
};
