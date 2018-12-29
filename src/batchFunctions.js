import _ from "lodash";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

export const batchLikes = async (keys, { Like }) => {
  const likes = await Like.findAll({
    raw: true,
    where: {
      shoeId: {
        [Op.in]: keys
      }
    }
  });
  let gl = _.groupBy(likes, "shoeId");
  return keys.map(k => (gl[k] ? gl[k].length : 0));
};
export const batchOwners = async (keys, { User }) => {
  const users = await User.findAll({
    where: {
      id: {
        [Op.in]: keys
      }
    }
  });
  return users;
};
export const batchReviewers = async (keys, { User }) => {
  const reviewers = await User.findAll({
    where: {
      id: {
        [Op.in]: keys
      }
    }
  });
  return reviewers;
};
export const batchReviews = async (keys, { Review }) => {
  const reviews = await Review.findAll(
    {
      where: {
        shoeId: {
          [Op.in]: keys
        }
      }
    },
    { raw: true }
  );
  let gr = _.groupBy(reviews, "shoeId");
  return keys.map(k => (gr[k] ? gr[k] : []));
};
