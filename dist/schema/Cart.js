"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apolloServer = require("apollo-server");

// items: Int!
exports.default = _apolloServer.gql`
  type Cart {
    id: Int!
    quantity: Int!
    shoes: [Shoe!]
    total: Float!
  }

  type Subscription {
    newItemAdded(cartId: Int!): Cart!
  }

  type ItemAddedToCartResponse {
    ok: Boolean!
    shoe: Shoe
    error: [Error!]
  }

  type FindOrCreateCartResponse {
    cart: Cart
    ok: Boolean!
    error: [Error!]
  }

  type Query {
    getCart(userId: Int!): Cart!
  }

  type Mutation {
    findOrCreateCart(userId: Int!): FindOrCreateCartResponse!
    addItem(userId: Int!, shoeId: Int!): Cart!
  }
`;