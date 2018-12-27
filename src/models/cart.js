export default (sequelize, DataTypes) => {
  let Cart = sequelize.define("cart", {
    items: { 
      type: DataTypes.INTEGER,
    },
    total: DataTypes.FLOAT,
  });

  Cart.associate = models => {
    Cart.hasMany(models.Shoe),
    Cart.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    })
  };

  return Cart;
};