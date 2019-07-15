const db = require("../data/dbConfig");
const supertest = require("supertest");
const server = require("../api/server");

const Users = require("../api/helpers/usersHelper.js");

describe("login and registration routes", () => {
  //NEED GLOBAL FUNCTIONS PROVIDE BY JEST THAT CLEAN UP TESTS HERE!!!
  //beforeAll  implements the clean up only once before tests are ran
  //beforeEach implements the clean up before each test is ran
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
// it("returns status 201 ", async () => {
//   let res = await request(server)
//     .post("/register")
//     .send({
//       id: "1",
//       firstname: "James",
//       lastname: "Smith",
//       username: "JSmith",
//       password: "pass",
//       email: "Jsmith@gmail.com",
//       role: "teacher"
//     });

//   expect(res.status).toBe(201);
// });

//     it("should return a 500 status code if firstname, lastname, username, password, email, role fields are not in body", async () => {
//       let res = await request(server)
//         .post("/register")
//         .send({
//           firstname: "James",
//           email: "Jsmith@gmail.com",
//           role: "teacher"
//         });

//       expect(res.status).toBe(500);
//     });
//   });
// });
// describe("post /login", () => {
//async test need to either return the promise

// it("responds with 200 OK", () => {
//   return supertest(server)
//     .post("/register")
//     .expect(200);
//   // .expect('Content-Type', /xml/i); would fail

//   //
// });

// it("returns status 200 ", async () => {
//   let res = await request(server)
//     .post("/login")
//     .send({
//       username: "JSmith",
//       password: "pass"
//     });

//   expect(res.status).toBe(200);
// });

//     it("returns status 500 if no password is sent ", async () => {
//       let res = await request(server)
//         .post("/login")
//         .send({
//           username: "JSmith"
//         });

//       expect(res.status).toBe(500);
//     });
//   });
// });
