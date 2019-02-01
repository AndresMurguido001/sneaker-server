"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryLoggingIn = exports.refreshTokens = exports.createTokens = undefined;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTokens = exports.createTokens = (user, secret, secret2) => {
  let token = _jsonwebtoken2.default.sign({
    user: _lodash2.default.pick(user, ["id", "firstname"])
  }, secret, {
    expiresIn: "1h"
  });
  let refreshToken = _jsonwebtoken2.default.sign({
    user: _lodash2.default.pick(user, ["id"])
  }, secret2, {
    expiresIn: "5h"
  });
  return Promise.all([token, refreshToken]);
};

const refreshTokens = exports.refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  let userId = 0;
  console.log("refreshing");
  try {
    // SECRET2
    const {
      user: { id }
    } = await _jsonwebtoken2.default.decode(refreshToken);

    userId = id;
  } catch (error) {
    return {};
  }
  if (!userId) {
    return {};
  }
  const user = await models.User.findOne({ where: { id: userId } }, { raw: true });

  if (!user) {
    return {};
  }
  const refreshSecret = user.password + SECRET2;
  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  };
};

const tryLoggingIn = exports.tryLoggingIn = async (email, password, models, SECRET, SECRET2) => {
  let user = await models.User.findOne({ where: { email } }, { raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: "email", message: "Cannot find user with this email" }]
    };
  }
  let validPassword = await _bcryptjs2.default.compare(password, user.password);

  if (!validPassword) {
    return {
      ok: false,
      errors: [{ path: "password", message: "Invalid Password" }]
    };
  }

  const refreshTokenSecret = user.password + SECRET2;
  let [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);
  return {
    ok: true,
    token: token,
    refreshToken: refreshToken
  };
};