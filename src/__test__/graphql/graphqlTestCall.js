import { graphql } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import models from "../../models";

const types = fileLoader(path.join(__dirname, "../../schema"));
const typeDefs = mergeTypes(types, { all: true });

const SECRET = "somesecretbull";
const SECRET2 = "somesecretotherbulls";

const resolverFiles = fileLoader(path.join(__dirname, "../../resolvers"));
const resolvers = mergeResolvers(resolverFiles, { all: true });

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const graphqlTestCall = async (query, variables, userId) =>
  graphql(
    schema,
    query,
    undefined,
    {
      user: userId,
      models,
      SECRET,
      SECRET2
    },
    variables
  );

// export const myMockServer = mockData => {
//   return mockServer(schema, mockData);
// };
