import express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
// import { ApolloServer } from 'apollo-server'
import bodyParser from "body-parser";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import path from "path";
import jwt from "jsonwebtoken";
import { refreshTokens } from "./auth";
import cors from "cors";
import DataLoader from "dataloader";
import {
  batchLikes,
  batchOwners,
  batchReviewers,
  batchReviews
} from "./batchFunctions";
//Subscriptions
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

import models from "../models";

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

export const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/subscriptions"
  },
  playground: {
    endpoint: `http://localhost:8080/graphql`,
    settings: {
      "editor.theme": "light"
    }
  },
  context: async ({ req }) => ({
    models,
    user: req.user,
    SECRET,
    SECRET2,
    likesLoader: new DataLoader(keys => batchLikes(keys, models)),
    ownerLoader: new DataLoader(keys => batchOwners(keys, models)),
    reviewerLoader: new DataLoader(keys => batchReviewers(keys, models)),
    reviewLoader: new DataLoader(keys => batchReviews(keys, models))
  })
});

apolloServer.applyMiddleware({
  app,
  addUser
});

const ws = createServer(app);
// apolloServer.installSubscriptionHandlers(ws);

models.sequelize.sync().then(() => {
  ws.listen(8080, x => {
    console.log(
      "Regular server running on http://localhost:8080",
      ` and ${apolloServer.subscriptionsPath} `
    );
    new SubscriptionServer(
      {
        execute: execute,
        subscribe: subscribe,
        schema: graphqlSchema,
        onConnect: async ({ token, refreshToken }, webSocket) => {
          console.log("WS CONNECTED");
          if (token && refreshToken) {
            try {
              let { user } = jwt.verify(token, SECRET);
              return { user, models };
            } catch (err) {
              const newTokens = await refreshToken(
                token,
                refreshToken,
                SECRET,
                SECRET2
              );
              user = newTokens.user;
              return { user, models };
            }
          }
          return { models };
        }
      },
      {
        server: ws,
        path: "/subscriptions"
      }
    );
  });
});
