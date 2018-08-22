import _ from "lodash";

export default (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(e => _.pick(e, ["path", "message"]));
  }
  return [{ path: "name", message: "Something went wrong" }];
};
