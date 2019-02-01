"use strict";

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("User", () => {
  beforeAll(() => {
    _models2.default.sequelize.sync({ force: true, logging: false }).then(() => {
      _models2.default.sequelize.close();
    });
  });

  it("Creates user successfully", async done => {
    let testUser = {
      firstname: "Andres",
      lastname: "Test",
      email: "test@test.com",
      password: "testpass"
    };
    const user = await _models2.default.User.create(testUser);
    expect({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    }).toEqual({
      email: testUser.email,
      firstname: testUser.firstname,
      lastname: testUser.lastname
    });
    done();
  });
});