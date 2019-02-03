"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlSchema = undefined;

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _apolloServerExpress = require("apollo-server-express");

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _auth = require("./auth");

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _dataloader = require("dataloader");

var _dataloader2 = _interopRequireDefault(_dataloader);

var _batchFunctions = require("./batchFunctions");

var _http = require("http");

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Subscriptions
const types = (0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./schema"));
const typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)(types, { all: true });

const resolverFiles = (0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./resolvers"));
const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)(resolverFiles, { all: true });

const SECRET = "ljasdASLDBlaskdljsdlasdjlAA";
const SECRET2 = "laiusdbflasbdvlblaiuybdAKJDSL";

const PORT = 8080;

const graphqlSchema = exports.graphqlSchema = (0, _apolloServerExpress.makeExecutableSchema)({
  typeDefs,
  resolvers
});

let app = (0, _express2.default)();

(0, _models2.default)().then(models => {
  if (!models) {
    console.log("Could not connect to db");
    return;
  }
  const addUser = async (req, res, next) => {
    let token = req.headers["x-token"];
    if (token) {
      try {
        const { user } = _jsonwebtoken2.default.verify(token, SECRET);
        req.user = user;
      } catch (error) {
        const refreshToken = req.headers["x-refreshtoken"];
        let newTokens = await (0, _auth.refreshTokens)(token, refreshToken, models, SECRET, SECRET2);
        if (newTokens.token && newTokens.refreshToken) {
          res.set("Access-Control-Expose-Headers", "x-token, x-refreshtoken");
          res.set("x-token", newTokens.token);
          res.set("x-refreshtoken", newTokens.refreshToken);
        }
        req.user = newTokens.user;
      }
    }
    next();
  };

  app.use(addUser, (0, _cors2.default)("*"));

  const apolloServer = new _apolloServerExpress.ApolloServer({
    typeDefs,
    resolvers,
    introspection: false,
    playground: false,
    subscriptions: {
      path: "/subscriptions",
      onConnect: async ({ token, refreshToken }, webSocket) => {
        if (token && refreshToken) {
          try {
            let { user } = _jsonwebtoken2.default.verify(token, SECRET);
            return { models, user };
          } catch (err) {
            const newTokens = await refreshToken(token, refreshToken, SECRET, SECRET2);
            user = newTokens.user;
            return { user, models };
          }
        }
        return { models };
      }
    },
    context: async ({ req }) => ({
      models,
      user: req ? req.user : null,
      SECRET,
      SECRET2,
      likesLoader: new _dataloader2.default(keys => (0, _batchFunctions.batchLikes)(keys, models)),
      ownerLoader: new _dataloader2.default(keys => (0, _batchFunctions.batchOwners)(keys, models)),
      reviewerLoader: new _dataloader2.default(keys => (0, _batchFunctions.batchReviewers)(keys, models)),
      reviewLoader: new _dataloader2.default(keys => (0, _batchFunctions.batchReviews)(keys, models))
    })
  });

  apolloServer.applyMiddleware({
    app
  });

  const server = (0, _http.createServer)(app);

  apolloServer.installSubscriptionHandlers(server);

  models.sequelize.sync().then(() => {
    server.listen(PORT, () => {
      console.log("Ready");
    });
  });
});