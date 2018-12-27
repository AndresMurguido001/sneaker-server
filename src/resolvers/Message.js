import { withFilter } from "graphql-subscriptions";

import { pubsub } from "../pubsub";

const NEW_MESSAGE = "NEW_MESSAGE";

export default {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (parent, args, context) => {
          console.log("PARENT: ", parent);
          return pubsub.asyncIterator(NEW_MESSAGE);
        },
        (payload, variables) => payload.channelId === variables.channelId
      )
    }
  },
  Channel: {
    receiver: async ({ receiverId }, args, { models }) => {
      let receiver = await models.User.findOne({ where: { id: receiverId } });
      return receiver;
    }
  },
  Message: {
    author: async ({ userId }, args, { models }) => {
      const author = await models.User.findOne({ where: { id: userId } });
      return author;
    },
  },
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      let message = await models.DirectMessage.create({
        ...args,
        userId: user.id
      });
      let currentUser = await models.User.findOne({ where: { id: user.id } });
      if (!message) {
        return false;
      }
      await pubsub.publish(NEW_MESSAGE, {
        channelId: args.channelId,
        newMessage: {
          ...message.dataValues,
          author: { id: currentUser.id, email: currentUser.email }
        }
      });
      return true;
    }
  },
  Query: {
    getChannelMessages: async (parent, { channelId }, { models, user }) => {
      const options = {
        order: [["created_at", "DESC"]],
        where: { channelId },
        limit: 35
      };
      let messages = await models.DirectMessage.findAll(options, { raw: true });
      return messages;
    }
  }
};
