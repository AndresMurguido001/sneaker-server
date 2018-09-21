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
    size: {
      type: DataTypes.FLOAT,
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
    numberOfLikes: {
      type: DataTypes.INTEGER,
      get: () => {}
    },
    photos: {
      type: DataTypes.STRING(1000),
      get: function() {
        return JSON.parse(this.getDataValue("photos"));
      },
      set: function(val) {
        return this.setDataValue("photos", JSON.stringify(val));
      }
    }
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
