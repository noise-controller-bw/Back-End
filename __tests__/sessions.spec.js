const request = require("supertest");
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
    it("should return 401 if user not authorized", async () => {
      const res = await request(server).get("/sessions");
      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(
        "No token provided, must be set on the Authorization Header"
      );
    });

    it("Should return sessions if user is authorized", async () => {
      const sessions = [
        {
          id: "1",
          user_id: 1,
          class_id: 1,
          date: "",
          score: 90,
          lessonName: "Reading"
        },
        {
          id: "2",
          user_id: 2,
          class_id: 1,
          date: "",
          score: 100,
          lessonName: "Science"
        }
      ];

      await db("sessions").insert(sessions);

      let res = await request(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let token = res.body.token;

      const res2 = await request(server)
        .get("/sessions")
        .set("authorization", `${token}`);
      expect(res2.status).toBe(200);
      expect(res2.body).toHaveLength(2);
    });

    it("should return all sessions in db to authorized user", async () => {
      const session = [
        {
          id: "1",
          date: "06/20/19",
          score: 80,
          lessonName: "Grammar"
        }
      ];

      await db("sessions").insert(session);

      let res = await request(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let token = res.body.token;

      const res1 = await request(server)
        .get("/sessions")
        .set("authorization", `${token}`);
      expect(res1.status).toBe(200);
      expect(res1.body).toEqual(session);
    });
  });

  //GET sessions By id
  describe("get Sessions By ID", () => {
    it("should return 401 if user not authorized", async () => {
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
      const res = await request(server).get("/sessions/1");
      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(
        "No token provided, must be set on the Authorization Header"
      );
    });

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

      let res1 = await request(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let token = res1.body.token;

      const res = await request(server)
        .get("/sessions")
        .set("authorization", `${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("returns empty array if no sessions stored", async () => {
      const session = await findSessionsById(1);

      expect(session).toEqual([]);
    });
  });

  //POST sessions
  describe("Post /sessions", () => {
    it("should return 401 if user not authorized", async () => {
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

      const res = await request(server)
        .post("/sessions")
        .send(sessions);
      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(
        "No token provided, must be set on the Authorization Header"
      );
    });

    it("should return 400 code if req info is not complete", async () => {
      let res1 = await request(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let token = res1.body.token;

      const session = {
        id: "1",
        date: "06/20/19"
      };

      const res = await request(server)
        .post("/sessions")
        .set("authorization", `${token}`)
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
      expect(sessions[0].score).toEqual(80);
    });
  });

  //UPDATE Sessions
  describe("updateSession", () => {
    const updatedSession = {
      date: "06/21/19",
      score: 65,
      lessonName: "Grammar"
    };

    it("should return 401 if user not authorized", async () => {
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

      const res = await request(server)
        .put("/sessions/1")
        .send(updatedSession);
      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(
        "No token provided, must be set on the Authorization Header"
      );
    });

    it("should update session for authorized user", async () => {
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

      let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });

      let token = res.body.token;

      let res1 = await request(server)
        .put("/sessions/1")
        .set("authorization", `${token}`)
        .send(updatedSession);
      expect(res1.status).toBe(200);
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

      let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });

      let token = res.body.token;

      let res1 = await request(server)
        .put("/sessions/1")
        .set("authorization", `${token}`)
        .send(updatedSession);
      expect(res1.body.message).toEqual("The session has been updated");
    });

    it("should return 404 for no session with provided id", async () => {
      const updatedSession = {
        date: "06/22/19",
        score: 90,
        lessonName: "Grammar"
      };

      let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });

      let token = res.body.token;

      let res2 = await request(server)
        .put("/sessions/3")
        .set("authorization", `${token}`)
        .send(updatedSession);
      expect(res2.status).toBe(404);
    });
  });

  //DELETE Sessions
  describe("removeSessions Model", () => {
    it("should return 401 if user not authorized", async () => {
      await addSessions({
        id: "1",
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      });

      const res = await request(server).delete("/sessions/1");
      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(
        "No token provided, must be set on the Authorization Header"
      );
    });

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

    it("should delete session for authorized user", async () => {
      const session = await addSessions({
        id: "1",
        date: "06/20/19",
        score: 80,
        lessonName: "Grammar"
      });

      let res = await request(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
      let token = res.body.token;

      const res2 = await request(server)
        .delete("/sessions/1")
        .set("authorization", `${token}`);
      expect(res2.status).toBe(200);
      expect(res2.body.message).toEqual("The session has been deleted");
    });
  });
});
