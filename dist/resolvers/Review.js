"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
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
    getReviews: async (parent, { shoeId }, { models }) => models.Review.findAll({ where: { shoeId } })
  },
  Mutation: {
    createReview: async (parent, args, { models }) => {
      let review = await models.Review.create(args);
      if (!review) {
        return {
          ok: false,
          errors: [{
            path: "CreateReview",
            message: "Could not create this review. Please try again"
          }]
        };
      }
      return {
        ok: true,
        review
      };
    }
  }
};