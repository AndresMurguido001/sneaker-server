"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.batchReviews = exports.batchReviewers = exports.batchOwners = exports.batchLikes = undefined;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Op = _sequelize2.default.Op;

const batchLikes = exports.batchLikes = async (keys, { Like }) => {
  const likes = await Like.findAll({
    raw: true,
    where: {
      shoeId: {
        [Op.in]: keys
      }
    }
  });
  let gl = _lodash2.default.groupBy(likes, "shoeId");
  return keys.map(k => gl[k] ? gl[k].length : 0);
};
const batchOwners = exports.batchOwners = async (keys, { User }) => {
  const users = await User.findAll({
    where: {
      id: {
        [Op.in]: keys
      }
    }
  });
  return users;
};
const batchReviewers = exports.batchReviewers = async (keys, { User }) => {
  const reviewers = await User.findAll({
    where: {
      id: {
        [Op.in]: keys
      }
    }
  });
  return reviewers;
};
const batchReviews = exports.batchReviews = async (keys, { Review }) => {
  const reviews = await Review.findAll({
    where: {
      shoeId: {
        [Op.in]: keys
      }
    }
  }, { raw: true });
  let gr = _lodash2.default.groupBy(reviews, "shoeId");
  return keys.map(k => gr[k] ? gr[k] : []);
};