"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphqlSubscriptions = require("graphql-subscriptions");

var _pubsub = require("../pubsub");

const NEW_MESSAGE = "NEW_MESSAGE";

exports.default = {
  Subscription: {
    newMessage: {
      subscribe: (0, _graphqlSubscriptions.withFilter)((parent, args, context) => {
        console.log("PARENT: ", parent);
        return _pubsub.pubsub.asyncIterator(NEW_MESSAGE);
      }, (payload, variables) => payload.channelId === variables.channelId)
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
    }
  },
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      let message = await models.DirectMessage.create(_extends({}, args, {
        userId: user.id
      }));
      let currentUser = await models.User.findOne({ where: { id: user.id } });
      if (!message) {
        return false;
      }
      await _pubsub.pubsub.publish(NEW_MESSAGE, {
        channelId: args.channelId,
        newMessage: _extends({}, message.dataValues, {
          author: { id: currentUser.id, email: currentUser.email }
        })
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