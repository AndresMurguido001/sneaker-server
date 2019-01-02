import { gql } from "apollo-server";
//Removed search shoes to make getAllShoes work for both search and all shoes.
// searchShoes(searchBy: String!): [Shoe!]!
export default gql`
  type Shoe {
    id: Int!
    brand: String!
    size: Float!
    photos: [String!]
    model: String!
    description: String!
    numberOfLikes: Int!
    owner: User!
    reviews: [Review!]!
    averageRating: Float!
    price: Float!
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
    getAllShoes(searchBy: String): [Shoe!]!
    getShoe(shoeId: Int!): GetShoeResponse!
  }
  type Mutation {
    signS3(filename: String!, filetype: String!): S3Payload!
    createShoe(
      brand: String!
      size: Float!
      price: Float!
      model: String!
      userId: Int!
      description: String!
      photos: [String!]
      numberOfLikes: Int = 0
    ): CreateShoeResponse!
    deleteShoe(shoeId: Int!): CreateShoeResponse!
  }
`;
