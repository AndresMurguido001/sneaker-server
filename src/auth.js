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
  return Promise.all([token, refreshToken]);
};

export const refreshTokens = async (
  token,
  refreshToken,
  models,
  SECRET,
  SECRET2
) => {
  let userId = 0;
  console.log("refreshing");
  try {
    // SECRET2
    const {
      user: { id }
    } = await jwt.decode(refreshToken);

    userId = id;
  } catch (error) {
    return {};
  }
  if (!userId) {
    return {};
  }
  const user = await models.User.findOne(
    { where: { id: userId } },
    { raw: true }
  );

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
      errors: [{ path: "email", message: "Cannot find user with this email" }]
    };
  }
  let validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return {
      ok: false,
      errors: [{ path: "password", message: "Invalid Password" }]
    };
  }

  const refreshTokenSecret = user.password + SECRET2;
  let [token, refreshToken] = await createTokens(
    user,
    SECRET,
    refreshTokenSecret
  );
  return {
    ok: true,
    token: token,
    refreshToken: refreshToken
  };
};
