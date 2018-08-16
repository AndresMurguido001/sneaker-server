import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import _ from "lodash";

export const createTokens = (user, secret, secret2) => {
  let token = jwt.sign(
    {
      user: _.pick(user, ["id", "firstname"])
    },
    secret,
    {
      expiresIn: "1h"
    }
  );
  let refreshToken = jwt.sign(
    {
      user: _.pick(user, ["id"])
    },
    secret2,
    {
      expiresIn: "5h"
    }
  );
  return [token, refreshToken];
};

export const refreshTokens = async (
  token,
  refreshToken,
  models,
  SECRET,
  SECRET2
) => {
  let userId = 0;
  try {
    const {
      user: { id }
    } = await jwt.verify(refreshToken, SECRET2);
    userId = id;
  } catch (error) {
    return {};
  }
  if (!userId) {
    return {};
  }
  const user = await models.User.findOne({ where: { id } }, { raw: true });

  if (!user) {
    return {};
  }
  const refreshSecret = user.password + SECRET2;
  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    refreshSecret
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  };
};

export const tryLoggingIn = async (
  email,
  password,
  models,
  SECRET,
  SECRET2
) => {
  let user = await models.User.findOne({ where: { email } }, { raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: "Email", message: "Cannot find user with this email" }]
    };
  }
  bcrypt.compare(password, user.password, (err, res) => {
    if (err) {
      return {
        ok: false,
        errors: [{ path: "Password", message: "Invalid Password" }]
      };
    }
  });
  const refreshTokenSecret = user.password + SECRET2;
  let [token, refreshToken] = createTokens(user, SECRET, refreshTokenSecret);
  return {
    ok: true,
    token: token,
    refreshToken: refreshToken
  };
};
