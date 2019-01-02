import formatErrors from "../formatErrors";
import aws from "aws-sdk";
import dotenv from "dotenv";
import Sequelize from "sequelize";

dotenv.config();

const Op = Sequelize.Op;

export default {
  Shoe: {
    owner: async ({ userId }, args, { ownerLoader }) => ownerLoader.load(userId),
    numberOfLikes: async ({ id }, args, { likesLoader }) => likesLoader.load(id),
    reviews: async ({ id }, args, { models }) => {
      return models.Review.findAll({ where: { shoeId: id } }, { raw: true });
    },
    averageRating: async ({ id }, args, { reviewLoader }) => {
      let reviews = await reviewLoader.load(id);
      if (reviews.length > 0) {
        let ratings = reviews.map(rev => rev.starRating).filter(i => i > 0);
        let sum = ratings.reduce((acc, cv) => acc + cv);
        return sum / ratings.length;
      }
      return 0;
    }
  },
  Query: {
    getAllShoes: async (parent, args, { models }) => {
      let filterString = args.searchBy;
      if (filterString) {
        let match = await models.Shoe.findAll({
          where: {
            [Op.or]: [
              {
                model: {
                  [Op.like]: `%${filterString}%`
                }
              },
              {
                brand: {
                  [Op.like]: `%${filterString}%`
                }
              }
            ]
          }
        });
        return match;
      } else {
        return models.Shoe.findAll();
      }
    },
    getShoe: async (parent, { shoeId }, { models }) => {
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
	      console.log("CREATE SHOE ERROR: ", error);
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
