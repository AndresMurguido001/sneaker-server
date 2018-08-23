import { gql } from "apollo-server";

export default gql`
  type Shoe {
    id: Int!
    brand: String!
    size: Int!
    photos: [String!]
    model: String!
    description: String!
    numberOfLikes: Int!
    owner: User!
  }

  type S3Payload {
    signedRequest: String!
    url: String!
  }

  type CreateShoeResponse {
    ok: Boolean!
    errors: [Error!]
    shoe: Shoe
  }

  type GetShoeResponse {
    ok: Boolean!
    errors: [Error!]
    shoe: Shoe
  }

  type Query {
    getAllShoes: [Shoe!]!
    getShoe(shoeId: Int!): GetShoeResponse!
  }
  type Mutation {
    signS3(filename: String!, filetype: String!): S3Payload!
    createShoe(
      brand: String!
      size: Int!
      model: String!
      userId: Int!
      description: String!
      photos: [String!]
      numberOfLikes: Int = 0
    ): CreateShoeResponse!
    deleteShoe(shoeId: Int!): CreateShoeResponse!
  }
`;
