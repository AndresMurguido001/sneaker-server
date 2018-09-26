import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: Int!
    email: String!
    firstname: String!
    lastname: String!
    shoes: [Shoe!]
    profilePic: String
    channels: [Channel!]
  }
  type Message {
    id: Int!
    text: String!
    author: User!
    created_at: String
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
  type LikedResponse {
    ok: Boolean!
    errors: [Error!]
  }
  type RegisterResponse {
    ok: Boolean!
    errors: [Error!]
    user: User!
  }
  type LoginResponse {
    ok: Boolean!
    errors: [Error!]
    token: String
    refreshToken: String
  }
  type Query {
    getUser(id: String!): User!
    allUsers: [User!]!
    getChannelMessages(channelId: Int!): [Message!]!
  }
  type ProfilePicResponse {
    ok: Boolean!
    errors: [Error!]
    profilePic: String!
  }
  type Mutation {
    registerUser(
      email: String!
      password: String!
      firstname: String!
      lastname: String!
    ): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
    uploadProfilePic(profilePic: String!): ProfilePicResponse!
    likeShoe(userId: Int!, shoeId: Int!): LikedResponse!
    createMessage(channelId: Int!, text: String!): Boolean!
    createChannel(receiverId: Int!, senderId: Int!): CreateChannelResponse!
  }
  type Subscription {
    newChannelMessage(channelId: Int!): Message!
  }
`;
