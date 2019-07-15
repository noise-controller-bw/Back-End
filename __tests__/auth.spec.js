const db = require("../data/dbConfig");
const supertest = require("supertest");
const server = require("../api/server");

const Users = require("../api/helpers/usersHelper.js");

describe("login and registration routes", () => {
  afterEach(async () => {
    await db("users").truncate();
  });

  describe("post /register", () => {
    //async test need to either return the promise
    beforeEach(async () => {
      await db("users").truncate();
    });

    it("responds with 201 status", async () => {
      let res = await supertest(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith",
          password: "test",
          email: "smith@gmail.com",
          role: "teacher"
        });

      expect(res.status).toBe(201);
    });
  });
});
