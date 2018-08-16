import formatErrors from "../formatErrors";

export default {
  Shoe: {
    owner: async ({ userId }, args, { models }) =>
      await models.User.findOne({ where: { id: userId } }, { raw: true })
  },
  Query: {
    getAllShoes: async (parent, args, { models }) => models.Shoe.findAll(),
    getShoe: async (parent, { shoeId }, { models }) => {
      let shoe = await models.Shoe.findOne(
        { where: { id: shoeId } },
        { raw: true }
      );
      if (!shoe) {
        return {
          ok: false,
          errors: [{ path: "Find Shoe", message: "These shoes dont exist" }]
        };
      }
      return {
        ok: true,
        shoe
      };
    }
  },
  Mutation: {
    createShoe: async (parent, args, { models }) => {
      try {
        let newShoes = await models.Shoe.create(args);
        return {
          ok: true,
          shoe: newShoes
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    },
    deleteShoe: async (parent, { shoeId }, { models }) => {
      let shoe = await models.Shoe.findOne(
        { where: { id: shoeId } },
        { raw: true }
      );
      if (!shoe) {
        return {
          ok: false,
          errors: [{ path: "Shoe", message: "Could not find these shoes" }]
        };
      }
      shoe.destroy();
      return {
        ok: true
      };
    }
  }
};
