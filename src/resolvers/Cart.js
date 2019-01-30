import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../pubsub";

const NEW_ITEM_ADDED = "NEW_ITEM_ADDED";

export default {
  Subscription: {
    newItemAdded: {
      subscribe: withFilter(
        (parent, args, context) => {
          return pubsub.asyncIterator(NEW_ITEM_ADDED);
        },
        (payload, variables) => {
          return payload.newItemAdded.id === variables.cartId;
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
    total: async ({ id }, args, { models, userId }) => {
      let total = await models.Shoe.sum(["price"], { where: { cartId: id } });
      if (total) {
        return total;
      } else {
        return 0;
      }
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
      let cart;
      const newItem = await models.Shoe.findOne({
        where: { id: args.shoeId }
      });
      if (newItem.userId === args.userId) {
        return false;
      }

      const updated = await newItem.update({
        cartId: args.userId
      });

      if (updated) {
        cart = await models.Cart.findOne({
          where: { userId: args.userId }
        });

        await pubsub.publish(NEW_ITEM_ADDED, { newItemAdded: cart.dataValues });

        return true;
	
      }

      return new Error("check updated if block");
    }
  }
};
