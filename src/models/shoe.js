export default (sequelize, DataTypes) => {
  let Shoe = sequelize.define("shoe", {
    brand: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Must provide a brand"
        }
      }
    },
    images: {
      type: DataTypes.STRING,
      validate: {
        max: {
          args: 3,
          msg: "Maximum of 3 photos"
        }
      }
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          args: true,
          msg: "Size must be a valid number between 5 and 15"
        },
        min: {
          args: 5,
          msg: "Size must be between 5 and 15"
        },
        max: {
          args: 15,
          msg: "Size must be between 5 and 15"
        }
      }
    },
    model: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Must provide a model"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Must provide a description"
        }
      }
    },
    numberOfLikes: DataTypes.INTEGER
  });

  Shoe.associate = models => {
    Shoe.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
  };

  return Shoe;
};
