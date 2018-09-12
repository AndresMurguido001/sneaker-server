import formatErrors from "../formatErrors";

export default {
  Review: {
    user: async ({ userId }, args, { models }) => {
      let user = await models.User.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("Error finding Reviewer, Check parent information");
      }
      return user;
    }
  },
  Query: {
    getReviews: async (parent, { shoeId }, { models }) =>
      models.Review.findAll({ where: { shoeId } })
  },
  Mutation: {
    createReview: (parent, args, { models }) => {
      let review = models.Review.create(args);
      if (!review) {
        return {
          ok: false,
          errors: [
            {
              path: "CreateReview",
              message: "Could not create this review. Please try again"
            }
          ]
        };
      }
      return {
        ok: true,
        review
      };
    }
  }
};
