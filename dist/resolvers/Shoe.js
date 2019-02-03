"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formatErrors = require("../formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const Op = _sequelize2.default.Op;

exports.default = {
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
        let sum = ratings.length > 0 ? ratings.reduce((acc, cv) => acc + cv) : 0;
        if (sum) {
          return sum;
        }
        return 0;
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
            [Op.or]: [{
              model: {
                [Op.like]: `%${filterString}%`
              }
            }, {
              brand: {
                [Op.like]: `%${filterString}%`
              }
            }]
          }
        });
        return match;
      } else {
        return models.Shoe.findAll();
      }
    },
    getShoe: async (parent, { shoeId }, { models }) => {
      let shoe = await models.Shoe.findOne({
        where: { id: shoeId }
      }, { raw: true });
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
      const s3 = new _awsSdk2.default.S3({
        signatureVersion: "v4",
        region: "us-east-1",
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
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
          errors: (0, _formatErrors2.default)(error, models)
        };
      }
    },
    deleteShoe: async (parent, { shoeId }, { models }) => {
      let shoe = await models.Shoe.findOne({ where: { id: shoeId } }, { raw: true });
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