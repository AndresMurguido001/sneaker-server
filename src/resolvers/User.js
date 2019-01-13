import { tryLoggingIn } from "../auth";
import formatErrors from "../formatErrors";

//Create Channel which gets created with pubsub.withfilter.
export default {
  User: {
    shoes: async ({ id }, args, { models }) =>
      models.Shoe.findAll({ where: { userId: id } }),
    channels: async ({ id }, args, { models }) => {
      let channels = await models.Channel.findAll({
        where: {
          $or: [
            {
              receiverId: id
            },
            {
              senderId: id
            }
          ]
        }
      });
      return channels;
    },
    cart: async ({id}, args, { models }) => await models.Cart.findOne({ where: {userId: id}}),
  },
  Query: {
    getUser: async (parent, { id }, { models, user }, info) => {
	    try {  
		    let integerId = parseInt(id, 10);
		    let usersProfile = await models.User.findOne(
			    { where: { id: integerId } },
			    { raw: true }
		    );
		   
		return usersProfile;

	    } catch(error) {
		    console.log("ERROR: ", error);
	    }
    },
    allUsers: (parent, args, context, info) => models.User.findAll()
  },
  Mutation: {
    registerUser: async (parent, args, { models }) => {
      try {
        let newUser = await models.User.create(args);
        let newCart = await models.Cart.create({ userId: newUser.id });
        if (newUser && newCart) {
          return {
            ok: true,
            user: newUser
          };
        }
      } catch (error) {
	      console.log("ERROR: ", error);
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    },
    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      await tryLoggingIn(email, password, models, SECRET, SECRET2),
    likeShoe: async (parent, args, { models }) => {
      let like = await models.Like.findOne(
        {
          where: {
            userId: args.userId,
            [models.Sequelize.Op.and]: [
              {
                shoeId: args.shoeId
              }
            ]
          }
        },
        { raw: true }
      );
      if (!like) {
        await models.Like.create(args);
        return {
          ok: true
        };
      }
      return {
        ok: false,
        errors: [
          {
            path: "like",
            message: "Seems like you have already liked this pair"
          }
        ]
      };
    },
    uploadProfilePic: async (parent, { profilePic }, { models, user }) => {
      const userToUpdate = await models.User.findOne(
        { where: { id: user.id } },
        { raw: true }
      );
      if (!user) {
        return {
          ok: false,
          errors: [
            {
              path: "Profile Picture",
              message: "Could not upload profile picture"
            }
          ]
        };
      }
      userToUpdate.profilePic = profilePic;
      userToUpdate.save();
      return {
        ok: true,
        profilePic: userToUpdate.profilePic
      };
    },
    createChannel: async (parent, { receiverId }, { models, user }) => {
      let channel = await models.Channel.findOne({
        where: {
          receiverId,
          senderId: user.id
        }
      });
      if (!channel) {
        let newlyCreatedChannel = await models.Channel.create({
          receiverId,
          senderId: user.id
        });
        if (!newlyCreatedChannel) {
          return {
            ok: false,
            errors: [
              {
                path: "Channel",
                message:
                  "Something went wrong when creating this channel. Please refresh and try again"
              }
            ]
          };
        }
        return {
          ok: true,
          channel: newlyCreatedChannel
        };
      }
      return {
        ok: true,
        channel
      };
    }
  }
};
