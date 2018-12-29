import { graphqlTestCall, myMockServer } from "./graphqlTestCall";
import models from "../../models";

const registerMutation = `
    mutation RegisterMutation($email: String!, $password: String!, $firstname: String!, $lastname: String!) {
        registerUser(email: $email, password: $password, firstname: $firstname, lastname: $lastname) {
            ok
        }
    }
`;

const loginMutation = `
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

describe("User Resolver", () => {
  it("registers user", async () => {
    expect.assertions(1);
    let {
      data: {
        registerUser: { ok }
      }
    } = await graphqlTestCall(registerMutation, {
      email: "test1@test1.com",
      password: "testpassword1",
      firstname: "testfirstname",
      lastname: "testlastname"
    });
    expect(ok).toBe(true);
  });

  it("logs user in", async () => {
    let { data } = await graphqlTestCall(loginMutation, {
      email: "test1@test1.com",
      password: "testpassword1"
    });
    // console.log("LOGIN MUTATION RESP: ", resp);
    expect(data.login.ok).toBe(true);
    expect(data.login.token).not.toBeNull();
    expect(data.login.refreshToken).not.toBeNull();
  });
});

afterAll(async () => {
  try {
    models.sequelize
      .sync({ force: true, logging: false })
      .then(() => models.sequelize.close());
  } catch (error) {
    console.log(`
        You did something wrong dummy!
        ${error}
      `);
    throw error;
  }
});
