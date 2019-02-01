"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apolloServer = require("apollo-server");

exports.default = _apolloServer.gql`
  type Review {
    id: Int!
    message: String!
    user: User!
    starRating: Float
    shoeId: Int!
  }

  type createReviewResponse {
    ok: Boolean!
    review: Review
    errors: [Error!]
  }

  type Query {
    getReviews(shoeId: Int!): [Review!]!
  }

  type Mutation {
    createReview(
      message: String!
      starRating: Float
      userId: Int!
      shoeId: Int!
    ): createReviewResponse!
  }
`;