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
  //beforeEach implements the clean up before each test is ran

  beforeEach(async () => {
    //truncate clears db very fast, used in seeding
    await db("sessions").truncate();
    await db("class").truncate();
    await db("users").truncate();
  });

  it("should set enviornment to testing", () => {
    //DB_ENV is global
    expect(process.env.DB_ENV).toBe("testing");
  });

  //Get all sessions
  describe("GET /sessions", () => {
    it("should return an empty array if no sessions are stored", async () => {
      const res = await supertest(server).get("/sessions");

      expect(res.body).toEqual([]);
    });

    it("HTTP status for Get /sessions is 200 if successful", async () => {
      const res = await supertest(server).get("/sessions");
      expect(res.status).toBe(200);
    });

    it("should return all sessions in db", async () => {
      const session = [
        {
          id: "1",
          date: "06/20/19",
          score: 80,
          lessonName: "Grammar"
        }
      ];

      await db("sessions").insert(session);

      const res = await supertest(server).get("/sessions");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(session);
    });
  });

  //GET sessions By id
  describe("get Sessions By ID", () => {
    it("finds session by id", async () => {
      const user = [
        {
          id: "1",
          ref_id: 1,
          firstname: "Jon",
          lastname: "Smith",
          username: "kSmith",
          password: "test",
          email: "Jsmith@gmail.com"
        }
      ];

      await db("users").insert(user);

      const classes = [
        {
          id: "1",
          ref_id: 1,
          name: "Ms. Angela's",
          grade: "1st"
        }
      ];

      await db("class").insert(classes);

      const sessions = [
        {
          id: "1",
          user_id: 1,
          class_id: 1,
          date: "",
          score: "100",
          lessonName: "Math"
        }
      ];

      await db("sessions").insert(sessions);
      const session = await findSessionsById("1");

      expect(session[0].firstname).toEqual("Jon");
    });

    it("returns additional info for class and users", async () => {
      const user = [
        {
          id: "1",
          ref_id: 1,
          firstname: "Jon",
          lastname: "Smith",
          username: "kSmith",
          password: "test",
          email: "Jsmith@gmail.com"
        }
      ];

      await db("users").insert(user);

      const classes = [
        {
          id: "1",
          ref_id: 1,
          name: "Ms. Angela's",
          grade: "1st"
        }
      ];

      await db("class").insert(classes);

      const sessions = [
        {
          id: "1",
          user_id: 1,
          class_id: 1,
          date: "",
          score: "100",
          lessonName: "Math"
        }
      ];

      const body = [
        {
          className: "Ms. Angela's",
          date: "",
          firstname: "Jon",
          grade: "1st",
          id: "1",
          lastname: "Smith",
          lessonName: "Math",
          score: 100
        }
      ];

      await db("sessions").insert(sessions);

      const res = await supertest(server).get("/sessions/1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body).toStrictEqual(body);
    });

    it("returns empty array if no sessions stored", async () => {
      const session = await findSessionsById(1);

      expect(session).toEqual([]);
    });
  });

  //POST sessions
  describe("Post /sessions", () => {
    it("should return 201 code if req info is complete", async () => {
      const session = {
        id: "1",
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      };
      const res = await supertest(server)
        .post("/sessions")
        .send(session);
      expect(res.status).toBe(201);
    });

    it("should return 400 code if req info is not complete", async () => {
      const session = {
        id: "1",
        date: "06/20/19",

        lessonName: "Grammar"
      };

      const res = await supertest(server)
        .post("/sessions")
        .send(session);
      expect(res.status).toBe(400);
    });
  });

  describe("addSessions model", () => {
    it("should insert provided session into the db", async () => {
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

  //UPDATE Sessions
  describe("updateSession", () => {
    it("should return 200", async () => {
      const session = await addSessions({
        id: "1",
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      });

      const updatedSession = {
        date: "06/21/19",
        score: 65,
        lessonName: "Grammar"
      };

      let res = await supertest(server)
        .put("/sessions/1")
        .send(updatedSession);
      expect(res.status).toBe(200);
    });

    it("should return the updated session", async () => {
      const session = await addSessions({
        id: "1",
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      });

      const updatedSession = {
        id: "1",
        date: "06/22/19",
        score: 90,
        lessonName: "Grammar"
      };

      let res = await supertest(server)
        .put("/sessions/1")
        .send(updatedSession);
      expect(res.body.message).toEqual("The session has been updated");
    });

    it("should return 404 for no session with provided id", async () => {
      const updatedSession = {
        date: "06/22/19",
        score: 90,
        lessonName: "Grammar"
      };

      let res = await supertest(server)
        .put("/sessions/3")
        .send(updatedSession);
      expect(res.status).toBe(404);
    });
  });

  //DELETE Sessions
  describe("removeSessions Model", () => {
    it("should delete a session", async () => {
      await addSessions({
        id: "1",
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      });

      await addSessions({
        id: "2",
        date: "06/21/19",
        score: 60,
        lessonName: "Math"
      });

      await removeSessions("2");
      const allSessions = await findSessions();

      expect(allSessions).toHaveLength(1);
    });
  });
});
