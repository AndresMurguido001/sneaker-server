'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: ["^[a-z]+$", "i"],
          msg: "First name must only contain letters."
        },
        len: {
          args: [5, 30],
          msg: "First name must be between 5 and 30 characters"
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: ["^[a-z]+$", "i"],
          msg: "Last name must only contain letters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Must be a valid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 30],
          msg: "Password must be between 6 and 30 characters"
        }
      }
    },
    profilePic: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      afterValidate: async user => {
        let haspass = await _bcryptjs2.default.hash(user.password, 10);
        user.password = haspass;
      }
    }
  });

  return User;
};