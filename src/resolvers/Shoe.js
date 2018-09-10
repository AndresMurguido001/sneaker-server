import formatErrors from "../formatErrors";
import aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

// {
//   let num = await models.Like.count({ where: { shoeId: id } });
//   return num;
// }
// await models.User.findOne({ where: { id: userId } }, { raw: true }),
export default {
  Shoe: {
    owner: async ({ userId }, args, { ownerLoader }) =>
      ownerLoader.load(userId),
    //
    numberOfLikes: async ({ id }, args, { likesLoader }) => likesLoader.load(id)
  },
  Query: {
    getAllShoes: async (parent, args, { models }) => models.Shoe.findAll(),
    getShoe: async (parent, { shoeId }, { models }) => {
      //Change this method or add one to search through shoes
      let shoe = await models.Shoe.findOne(
        {
          where: { id: shoeId }
        },
        { raw: true }
      );
      if (!shoe) {
        return {
          ok: false,
          errors: [{ path: "Find Shoe", message: "These shoes dont exist" }]
        };
      }
      return {
        ok: true,
        shoe
      };
    }
  },
  Mutation: {
    signS3: async (parent, { filename, filetype }, { models }) => {
      const s3 = new aws.S3({
        signatureVersion: "v4",
        region: "us-east-1"
      });
      let s3Bucket = process.env.BUCKET_NAME;
      const s3Params = {
        Bucket: s3Bucket,
        Key: filename,
        Expires: 60,
        ContentType: filetype,
        ACL: "public-read"
      };
      const signedRequest = await s3.getSignedUrl("putObject", s3Params);
      const url = `https://${s3Bucket}.s3.amazonaws.com/${filename}`;
      return {
        signedRequest,
        url
      };
    },
    createShoe: async (parent, args, { models }) => {
      try {
        let newShoes = await models.Shoe.create(args);

        return {
          ok: true,
          shoe: newShoes
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    },
    deleteShoe: async (parent, { shoeId }, { models }) => {
      let shoe = await models.Shoe.findOne(
        { where: { id: shoeId } },
        { raw: true }
      );
      if (!shoe) {
        return {
          ok: false,
          errors: [{ path: "Shoe", message: "Could not find these shoes" }]
        };
      }
      shoe.destroy();
      return {
        ok: true
      };
    }
  }
};
