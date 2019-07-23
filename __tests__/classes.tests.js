const request = require("supertest");
const server = require("../api/server.js");

const db = require("../data/dbConfig.js");
const Classes = require("../api/helpers/classesHelper.js");

const { authenticate } = require("../auth/authenticate.js");
const { checkRole } = require("../MiddleWare/checkRole.js");

// GET

describe("GET /classes", () => {
  // cleanup for db
  afterEach(async () => {
    await db("class").truncate();
    await db("users").truncate();
  });

  it('should return 401 to unauthorized user', async () => {

    const res = await request(server).get('/classes');

    expect(res.status).toBe(401);

});

  it("should return 200 to authorized user", async () => {

    let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
    });

    let token = res.body.token;

    const res2 = await request(server).get("/classes").set('authorization', `${token}`);

    expect(res2.status).toBe(200);

  });

  it("should return classes to authorized user", async () => {

    let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
    });

    let token = res.body.token;

    const res2 = await request(server).get("/classes").set('authorization', `${token}`);

    expect(res2.status).toBe(200);
    expect(res2.body).toEqual([]);
  });

  it("should return all classes in db to authorized user", async () => {

    let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          ref_id: 1,
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
    });

    let token = res.body.token;

    // id should be a string!
    const testClass = [
      {
        id: "1",
        ref_id: 1,
        name: "Ms. Angela's",
        grade: "1st"
      }
    ];

    await db("class").insert(testClass);

    const res2 = await request(server).get("/classes").set('authorization', `${token}`);

    expect(res2.status).toBe(200);
    expect(res2.body).toEqual(testClass);
  });
});

// GET by Id

describe("getClassById", () => {
  // cleanup for db
  afterEach(async () => {
    await db("class").truncate();
    await db("users").truncate();
  });

  it('should return 401 to unauthorized user', async () => {

    const res = await request(server).get('/classes/1');

    expect(res.status).toBe(401);

  });

  it("finds a class by id (helper)", async () => {

    await db("class").insert([
      {
        id: "1",
        name: "Ms. Angela's",
        grade: "1st"
      },
      {
        id: "2",
        name: "Mr. Nick's",
        grade: "4th"
      }
    ]);

    const myClass = await Classes.getClassById("2");

    expect(myClass.grade).toEqual("4th");
  });

  it("finds a class by id (route)", async () => {

    let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
    });
    
    let token = res.body.token;

    await db("class").insert([
      {
        id: "1",
        name: "Ms. Angela's",
        grade: "1st"
      },
      {
        id: "2",
        name: "Mr. Nick's",
        grade: "4th"
      }
    ]);

    let response = await request(server).get('/classes/2').set('authorization', `${token}`);

    const myClass = await Classes.getClassById("2");

    expect(response.body.grade).toEqual("4th");
  });

  it("returns undefined of invalid id", async () => {
    const myClass = await Classes.getClassById("2");

    expect(myClass).toBeUndefined();
  });

  // POST

  describe("addClass", () => {
    // cleanup for db
    afterEach(async () => {
      await db("class").truncate();
      await db("users").truncate();
    });

    it('should return 401 to unauthorized user', async () => {

      const res = await request(server).post('/classes');

      expect(res.status).toBe(401);

    });

    it("should insert classes into the db", async () => {
      await Classes.addClass({
        id: "1",
        name: "Ms. Jen's",
        grade: "1st"
      });
      await Classes.addClass({
        id: "2",
        name: "Mr. Nick's",
        grade: "4th"
      });

      const recievedClasses = await db("class");

      expect(recievedClasses).toHaveLength(2);
      expect(recievedClasses[0].name).toBe("Ms. Jen's");
    });

    it("should return a status code of 201 to authorized user", async () => {

      let res = await request(server)
      .post("/register")
      .send({
        id: "1",
        firstname: "Matt",
        lastname: "Smith",
        username: "Msmith9",
        password: "test",
        email: "smith5w@gmail.com",
        role: "admin"
      });

      let token = res.body.token;

      let response = await request(server)
        .post("/classes")
        .set('authorization', `${token}`)
        .send({
          id: "1",
          name: "Ms. Jen's",
          grade: "1st"
        });

      expect(response.status).toBe(201);
    });

    it("should return the new class on insert (helper)", async () => {
      const newClass = await Classes.addClass({
        id: "1",
        ref_id: 1,
        name: "Ms. Patty's",
        grade: "1st"
      });

      expect(newClass).toEqual({
        id: "1",
        ref_id: 1,
        name: "Ms. Patty's",
        grade: "1st"
      });
    });

    it("should return the new class on insert (route)", async () => {

      let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
      });

      let token = res.body.token;

      const response = await request(server)
      .post("/classes")
      .set('authorization', `${token}`)
      .send({
        name: "Ms. Patty's",
        grade: "1st"
      });

      expect(response.body.name).toBe("Ms. Patty's");
      expect(response.body.grade).toBe("1st");

    });

    it("should return a `422` status code if name field is not included inside the body to authorized user", async () => {

      let res = await request(server)
      .post("/register")
      .send({
        id: "1",
        firstname: "Matt",
        lastname: "Smith",
        username: "Msmith9",
        password: "test",
        email: "smith5w@gmail.com",
        role: "admin"
      });

      let token = res.body.token;

      let response = await request(server)
        .post("/classes")
        .set('authorization', `${token}`)
        .send({ grade: "1st" });

      expect(response.status).toBe(422);
    });
  });

  //UPDATE
  describe("update Class", () => {
    it("should return 200", async () => {
      const classes = await Classes.addClass({
        id: "1",
        ref_id: 1,
        name: "Mr. Smith's",
        grade: "5th"
      });

      const updatedClass = {
        id: "1",
        ref_id: 1,
        name: "Mrs. Jan's",
        grade: "6th"
      };

      let res = await request(server)
        .put("/classes/1")
        .send(updatedClass);
      expect(res.status).toBe(200);
    });

    it("should return the updated class", async () => {
      const classes = await Classes.addClass({
        id: "1",
        ref_id: 1,
        name: "Ms. Smith's",
        grade: "1st"
      });

      const updatedClass = {
        id: "1",
        ref_id: 1,
        name: "Ms. Tino's",
        grade: "4th"
      };

      let res = await request(server)
        .put("/classes/1")
        .send(updatedClass);
      expect(res.body.message).toEqual("The class has been updated");
    });

    it("should return 404 for no class with provided id", async () => {
      const updatedClass = {
        id: "1",
        ref_id: 1,
        name: "Ms. Tino's",
        grade: "4th"
      };

      let res = await request(server)
        .put("/classes/3")
        .send(updatedClass);
      expect(res.status).toBe(404);
    });
  });

  //DELETE
  describe("remove Classes", () => {
    it("delete class helper should delete a class", async () => {
      await Classes.addClass({
        id: "1",
        ref_id: 1,
        name: "Ms. Tino's",
        grade: "4th"
      });

      await Classes.addClass({
        id: "2",
        ref_id: 2,
        name: "Ms. Thompson",
        grade: "5th"
      });

      await Classes.removeClass("1");

      const deletedClass = await Classes.getClassById("1");
      const remained = await Classes.getClassById("2");
      expect(deletedClass).toBeUndefined();
      expect(remained.grade).toBe("5th");
    });

    it("should respond with unauthorized status 401, if user not unauthorized to perform delete", async () => {
      beforeEach(async () => {
        //truncate clears db very fast, used in seeding
        await db("class").truncate();
        await db("users").truncate();
      });

      const classes = [
        {
          id: "1",
          ref_id: 1,
          name: "Ms. Angela's",
          grade: "1st"
        }
      ];

      await db("class").insert(classes);
      const user = [
        {
          id: "1",
          ref_id: 1,
          firstname: "Jon",
          lastname: "Smith",
          username: "kSmith",
          password: "test",
          email: "Jsmith@gmail.com",
          role: "teacher"
        }
      ];
      await db("users").insert(user);

      const res1 = await request(server).delete("/classes/1");
      expect(res1.status).toBe(401);
    });
  });

  //GET CLASS SESSIONS
  describe("get Class Sessions", () => {
    beforeEach(async () => {
      //truncate clears db very fast, used in seeding
      await db("sessions").truncate();
      await db("class").truncate();
      await db("users").truncate();
    });

    it("get /classes/id/sesssions returns 200", async () => {
      const res = await request(server).get("/classes/1/sessions");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
    it("finds sessions info by class id", async () => {
      const user = [
        {
          id: "1",
          ref_id: 1,
          firstname: "Jon",
          lastname: "Smith",
          username: "kSmith",
          password: "test",
          email: "Jsmith@gmail.com"
        },
        {
          id: "2",
          ref_id: 2,
          firstname: "Jan",
          lastname: "Smithson",
          username: "JSmith",
          password: "test",
          email: "Jansmith@gmail.com"
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
        },
        {
          id: "3",
          user_id: 1,
          class_id: 1,
          date: "",
          score: 80,
          lessonName: "Math"
        }
      ];

      await db("sessions").insert(sessions);
      const score = await Classes.getClassSession("1");

      expect(score[0].score).toEqual(90);
      expect(score).toHaveLength(3);
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
          id: "1",
          firstname: "Jon",
          lastname: "Smith",
          lessonName: "Math",
          date: "",
          score: 100
        }
      ];

      await db("sessions").insert(sessions);

      const res = await request(server).get("/classes/1/sessions");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body).toStrictEqual(body);
    });

    it("returns empty array if no session stored", async () => {
      const score = await Classes.getClassSession(1);

      expect(score).toEqual([]);
    });
  });

  //GET CLASS USERS
  describe("get Class Users", () => {
    beforeEach(async () => {
      //truncate clears db very fast, used in seeding
      await db("sessions").truncate();
      await db("class").truncate();
      await db("users").truncate();
    });

    it("get /classes/id/users returns 200", async () => {
      const res = await request(server).get("/classes/id/users");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
    it("finds users info by class id", async () => {
      const user = [
        {
          id: "1",
          ref_id: 1,
          firstname: "Jon",
          lastname: "Smith",
          username: "kSmith",
          password: "test",
          email: "Jsmith@gmail.com"
        },
        {
          id: "2",
          ref_id: 2,
          firstname: "Jan",
          lastname: "Smithson",
          username: "JSmith",
          password: "test",
          email: "Jansmith@gmail.com"
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
        },
        {
          id: "3",
          user_id: 1,
          class_id: 1,
          date: "",
          score: 80,
          lessonName: "Math"
        }
      ];

      await db("sessions").insert(sessions);
      const users = await Classes.getClassUsers("1");

      expect(users[0].firstname).toEqual("Jon");
      expect(users).toHaveLength(2);
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
          id: "1",
          firstname: "Jon",
          lastname: "Smith",
          email: "Jsmith@gmail.com"
        }
      ];

      await db("sessions").insert(sessions);

      const res = await request(server).get("/classes/1/users");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body).toStrictEqual(body);
    });

    it("returns empty array if no session stored", async () => {
      const score = await Classes.getClassUsers(1);

      expect(score).toEqual([]);
    });
  });
});
