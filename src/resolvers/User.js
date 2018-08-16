import { tryLoggingIn } from "../auth";
import shoe from "../models/shoe";

export default {
  User: {
    shoes: async ({ id }, args, { models }) =>
      models.Shoe.findAll({ where: { userId: id } })
  },
  Query: {
    getUser: (parent, { userId }, { models }, info) =>
      models.User.findOne({ where: { id: userId } }, { raw: true }),
    allUsers: (parent, args, context, info) => models.User.findAll()
  },
  Mutation: {
    registerUser: async (parent, args, { models }) => {
      try {
        let newUser = await models.User.create(args);
        return {
          ok: true,
          user: newUser
        };
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    },
    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      await tryLoggingIn(email, password, models, SECRET, SECRET2),
    likeShoe: async (parent, args, { models }) => {
      let like = await models.Like.create(args);
      if (!like) {
        return {
          ok: false,
          errors: [
            {
              path: "Like",
              msg: "Something went wrong when liking these shoes"
            }
          ]
        };
      }

      return {
        ok: true
      };
    }
  }
};
