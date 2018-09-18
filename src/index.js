import express from "express";
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import path from "path";
import jwt from "jsonwebtoken";
import { refreshTokens } from "./auth";
import cors from "cors";
import DataLoader from "dataloader";
import { batchLikes, batchOwners, batchReviewers } from "./batchFunctions";

import models from "./models";

const types = fileLoader(path.join(__dirname, "./schema"));
const typeDefs = mergeTypes(types, { all: true });

const resolverFiles = fileLoader(path.join(__dirname, "./resolvers"));
const resolvers = mergeResolvers(resolverFiles, { all: true });

const SECRET = "ljasdASLDBlaskdljsdlasdjlAA";
const SECRET2 = "laiusdbflasbdvlblaiuybdAKJDSL";

const addUser = async (req, res, next) => {
  let token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (error) {
      const refreshToken = req.headers["x-refreshtoken"];
      let newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        SECRET2
      );
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
let app = express();
app.use(bodyParser.json(), addUser, cors("*"));

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  playground: {
    endpoint: `http://localhost:8080/graphql`,
    settings: {
      "editor.theme": "dark"
    }
  },
  context: async ({ req }) => ({
    models,
    user: req.user,
    SECRET,
    SECRET2,
    likesLoader: new DataLoader(keys => batchLikes(keys, models)),
    ownerLoader: new DataLoader(keys => batchOwners(keys, models)),
    reviewerLoader: new DataLoader(keys => batchReviewers(keys, models))
  })
});

server.applyMiddleware({
  app,
  addUser
});

models.sequelize.sync().then(function() {
  app.listen(8080, () => {
    console.log("Working");
  });
});
