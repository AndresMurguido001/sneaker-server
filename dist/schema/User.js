"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apolloServer = require("apollo-server");

exports.default = _apolloServer.gql`
  type User {
    id: Int!
    email: String!
    firstname: String!
    lastname: String!
    shoes: [Shoe!]
    profilePic: String
    channels: [Channel!]
    cart: Cart!
  }
  type LikedResponse {
    ok: Boolean!
    errors: [Error!]
  }
  type RegisterResponse {
    ok: Boolean!
    errors: [Error!]
    user: User!
  }
  type LoginResponse {
    ok: Boolean!
    errors: [Error!]
    token: String
    refreshToken: String
  }
  type Query {
    getUser(id: String!): User!
    allUsers: [User!]!
  }
  type ProfilePicResponse {
    ok: Boolean!
    errors: [Error!]
    profilePic: String!
  }
  type Mutation {
    registerUser(
      email: String!
      password: String!
      firstname: String!
      lastname: String!
    ): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
    uploadProfilePic(profilePic: String!): ProfilePicResponse!
    likeShoe(userId: Int!, shoeId: Int!): LikedResponse!
  }
`;