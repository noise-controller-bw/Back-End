const supertest = require("supertest");
const server = require("../api/server.js");
const db = require("../data/dbConfig.js");
const {
  findSessions,
  findSessionsById,
  addSessions,
  removeSessions
} = require("../api/helpers/sessionHelper.js");

describe("sessions helpers", () => {
  //NEED GLOBAL FUNCTIONS PROVIDE BY JEST THAT CLEAN UP TESTS HERE!!!
  //beforeAll  implements the clean up only once before tests are ran
  //beforeEach implements the clean up before each test is ran

  beforeEach(async () => {
    //truncate clears db very fast, used in seeding
    await db("sessions").truncate();
  });

  it("should set enviornment to testing", () => {
    //DB_ENV is global
    expect(process.env.DB_ENV).toBe("testing");
  });

  describe("addSessions ", () => {
    it("should insert provided users into the db", async () => {
      // await db('users').truncate();
      await addSessions({
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      });

      const sessions = await db("sessions");

      expect(sessions).toHaveLength(1);
      expect(sessions[0].lessonName).toBe("Grammar");
    });
  });

  describe("delete()", () => {
    it("should delete a agame", async () => {
      await addSessions({
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      });

      await addSessions({
        date: "06/21/19",
        score: 60,
        lessonName: "Math"
      });

      await removeSessions(1);

      const deletedsession = await findSessionsById(1);
      const remained = await findSessionsById(2);
      expect(deletedsession).toBeUndefined();
      expect(remained.lessonName).toBe("Math");
    });
  });

  describe("Get(/sessions)", () => {
    it("should have an array of 0 length if no sessions stored", async () => {
      const sessions = await db("sessions");
      expect(sessions).toHaveLength(0);
    });

    it("another way to find empty array", async () => {
      const res = await supertest(server).get("/sessions");

      expect(res.body).toEqual([]);
    });

    it("HTTP status for Get(/games) 200 if successful", async () => {
      const res = await supertest(server).get("/sessions");
      expect(res.status).toBe(200);
    });
  });

  describe("Post(/sessions)", () => {
    it("should return 201 code if req info is complete", async () => {
      const session = {
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      };
      const res = await supertest(server)
        .post("/sessions")
        .send(session);
      expect(res.status).toBe(201);
    });

    it("should return 422 code if req info is not complete", async () => {
      const session = {
        date: "06/20/19",

        lessonName: "Grammar"
      };

      const res = await supertest(server)
        .post("/sessions")
        .send(session);
      expect(res.status).toBe(422);
    });

    it("req body should have list of games", async () => {
      const session = {
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar",
        id: 1
      };

      const res = await supertest(server)
        .post("/games")
        .send(game1);
      expect(res.body).toStrictEqual(game);
    });
  });
});

// it('getting 201 status code if the information is complete', () => {
//     const game = { title: 'Pacman', genre: 'Arcade' };
//     return request(app)
//         .post('/games')
//         .send(game)
//         .expect(201)
// });
