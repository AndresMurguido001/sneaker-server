export default (sequelize, DataTypes) => {
  const Cart = sequelize.define("cart", {
	  items: DataTypes.INTEGER,
	  total: DataTypes.DECIMAL(12, 2),
  });
Cart.associate = (models) => {
	Cart.belongsTo(models.User, {
		foreignKey: {
			name: "userId",
			field: "user_id"
		}
	})
}
  return Cart;
}
