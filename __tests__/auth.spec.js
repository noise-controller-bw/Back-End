const db = require("../data/dbConfig");
const supertest = require("supertest");
const server = require("../api/server");

const Users = require("../api/helpers/usersHelper.js");

// REGISTER TESTS
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
          email: "smith5w@gmail.com",
          role: "teacher"
        });

      expect(res.status).toBe(201);
    });

    it("responds with `Please fill out missing fields!` if field is missing", async () => {
      beforeEach(async () => {
        await db("users").truncate();
      });
      let res = await supertest(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });

      expect(res.body.message).toEqual("Please fill out missing fields!");
    });

    it("returns provided user in res body upon succeeding registration", async () => {
      beforeEach(async () => {
        await db("users").truncate();
      });

      let newUser = {
        firstname: "Matt",
        lastname: "Smith",
        username: "Msmith",
        password: "test",
        email: "smith5w@gmail.com"
      };
      let res = await supertest(server)
        .post("/register")
        .send(newUser);

      expect(res.body.user.username).toEqual("Msmith");
    });
  });

  //LOGIN TESTS

  describe("post /login", () => {
    //async test need to either return the promise
    beforeEach(async () => {
      await db("users").truncate();
    });

    it("responds with 200 status", async () => {
      let res = await supertest(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let res2 = await supertest(server)
        .post("/login")
        .send({
          username: "Msmith",
          password: "test"
        });

      expect(res2.status).toBe(200);
    });

    it("responds with welcome message", async () => {
      beforeEach(async () => {
        await db("users").truncate();
      });
      let res = await supertest(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let res2 = await supertest(server)
        .post("/login")
        .send({
          username: "Msmith9",
          password: "test"
        });

      expect(res2.body.message).toEqual("Welcome Msmith9!");
    });

    it("responds with status 401 if  password or username is invalid", async () => {
      let res = await supertest(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let res2 = await supertest(server)
        .post("/login")
        .send({
          username: "Msmith",
          password: "pasword"
        });

      expect(res2.body.message).toEqual("Invalid Credentials");
    });

    it("responds with `please fill out missing fields` if missing username or password", async () => {
      beforeEach(async () => {
        await db("users").truncate();
      });
      let res = await supertest(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let res2 = await supertest(server)
        .post("/login")
        .send({
          password: "pasword"
        });

      expect(res2.body.message).toEqual("Please fill out missing fields!");
    });
  });
});
