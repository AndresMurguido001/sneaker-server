import { gql } from "apollo-server";

export default gql`
  type Subscription {
    newMessage(channelId: Int!): Message
  }
  type Channel {
    id: Int!
    receiver: User!
    messages: [Message!]
  }
  type CreateChannelResponse {
    ok: Boolean!
    channel: Channel!
    errors: [Error!]
  }
  type Message {
    id: Int!
    text: String!
    author: User
    created_at: String
  }
  type Query {
    getChannelMessages(channelId: Int!): [Message!]!
  }
  type Mutation {
    createMessage(channelId: Int!, text: String!): Boolean!
    createChannel(receiverId: Int!, senderId: Int!): CreateChannelResponse!
  }
`;
