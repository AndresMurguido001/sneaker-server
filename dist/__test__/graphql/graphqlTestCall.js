"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlTestCall = undefined;

var _graphql = require("graphql");

var _graphqlTools = require("graphql-tools");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const types = (0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "../../schema"));
const typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)(types, { all: true });

const SECRET = "somesecretbull";
const SECRET2 = "somesecretotherbulls";

const resolverFiles = (0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "../../resolvers"));
const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)(resolverFiles, { all: true });

const schema = (0, _graphqlTools.makeExecutableSchema)({ typeDefs, resolvers });

const graphqlTestCall = exports.graphqlTestCall = async (query, variables, userId) => (0, _graphql.graphql)(schema, query, undefined, {
  user: userId,
  models: _models2.default,
  SECRET,
  SECRET2
}, variables);

// export const myMockServer = mockData => {
//   return mockServer(schema, mockData);
// };