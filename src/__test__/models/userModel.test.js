import models from "../../models";

describe("User", () => {
  beforeAll(() => {
    models.sequelize.sync({ force: true, logging: false }).then(() => {
      models.sequelize.close();
    });
  });

  it("Creates user successfully", async done => {
    let testUser = {
      firstname: "Andres",
      lastname: "Test",
      email: "test@test.com",
      password: "testpass"
    };
    const user = await models.User.create(testUser);
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
