import _ from "lodash";

export const batchLikes = async (keys, { Like }) => {
  const likes = await Like.findAll({
    raw: true,
    where: {
      shoeId: {
        $in: keys
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
        $in: keys
      }
    }
  });
  return users;
};
