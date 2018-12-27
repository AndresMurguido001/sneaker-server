import { gql } from "apollo-server";

export default gql`
  type Cart {
    id: Int!
    quantity: Int!
    items: [Shoe!]
    total: Float!    
  }

 type Subscription {
    newItemAdded(shoeId: Int!): Shoe
  }

  type ItemAddedToCartResponse {
      ok: Boolean!
      shoe: Shoe
      error: [Error!]
  }

  type FindOrCreateCartResponse {
      cart: Cart
      ok: Boolean!
      error: [Error!]
  }

  type Query {
    getCartShoes(cartId: Int!): [Shoe!]!
  }

  type Mutation {
    findOrCreateCart(userId: Int!): FindOrCreateCartResponse!
    addItem(cartId:Int!, shoeId: Int!): Boolean
  }
`;

