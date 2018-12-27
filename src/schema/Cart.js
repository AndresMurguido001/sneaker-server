import { gql } from "apollo-server";

export default gql`
  type Cart {
    id: Int!
    items: Int!
    shoes: [Shoe!]
    total: Float!    
  }

 type Subscription {
    newItemAdded(itemId: Int!): Boolean
  }

  type FindOrCreateCartResponse {
      shoes: [Shoe!]
      ok: Boolean!
      error: [Error!]
  }

  type Query {
    getCartShoes(cartId: Int!): [Shoe!]!
  }

  type Mutation {
    findOrCreateCart(userId: Int!): FindOrCreateCartResponse!
    addItem(shoeId: Int!): Boolean
  }
`;

