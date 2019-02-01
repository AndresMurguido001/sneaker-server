"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apolloServer = require("apollo-server");

exports.default = _apolloServer.gql`
  type Error {
    path: String!
    message: String
  }
`;