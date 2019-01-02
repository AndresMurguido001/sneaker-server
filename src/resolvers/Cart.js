import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../pubsub";

const NEW_ITEM_ADDED = "NEW_ITEM_ADDED";

export default {
  Subscription: {
    newItemAdded: {
      subscribe: withFilter(
        (parent, args, context) => {
		console.log("ARGS!: ", args);
          return pubsub.asyncIterator(NEW_ITEM_ADDED);
        },
        (payload, variables) => {
		console.log("PAYLOAD", payload)
		console.log("VARIABLES: ", variables);
		return payload.cartId === variables.cartId 
	}
      )
    }
  },
  Cart: {
    shoes: async ({ id }, args, { models }, info) => {
      let shoes = await models.Shoe.findAll({ where: { cartId: id } });
      return shoes;
    },
    quantity: async ({ id }, args, { models }) => {
      let numberOfItems = await models.Shoe.count({ where: { cartId: id } });
      return numberOfItems;
    },
    total: ({ id }, args, { models, userId }) => {
      // Add price fireld to shoes model
	    let total = models.Shoe.sum('price', { where: { cartId: id }});
	    return total;
    }
  },
  Query: {
    getCart: async (parent, args, { models, userId }) => {
      // Change to use CURRENT USER ID, instead of args
      let currentUsersCart = await models.Cart.findOne({
        where: { userId: args.userId }
      });

      return currentUsersCart;
    }
  },
  Mutation: {
    addItem: async (parent, args, { models, userId }, info) => {
      const newItem = await models.Shoe.findOne({
        where: {
          id: args.shoeId
        }
      });
      if (!newItem) {
        return false;
      }
      //   add cart_id to me query
      newItem.update({
        cartId: args.cartId
      });
      await pubsub.publish(NEW_ITEM_ADDED, {
        shoe: newItem
      });
      return true;
    }
  }
};
