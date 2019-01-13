import formatErrors from "../formatErrors";

export default {
  Review: {
    user: async ({ userId }, args, { reviewerLoader }) => {
      let reviewers = reviewerLoader.load(userId);
      if (!reviewers) {
        throw new Error("Error finding Reviewer, Check parent information");
      }
      return reviewers;
    }
  },
  Query: {
    getReviews: async (parent, { shoeId }, { models }) =>
      models.Review.findAll({ where: { shoeId } })
  },
  Mutation: {
    createReview: async (parent, args, { models }) => {
      let review = await models.Review.create(args);
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
