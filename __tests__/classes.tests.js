const request = require("supertest");
const server = require("../api/server.js");

const db = require("../data/dbConfig.js");
const Classes = require("../api/helpers/classesHelper.js");

// GET
describe("GET /classes", () => {
  // cleanup for db
  afterEach(async () => {
    await db("class").truncate();
    await db("users").truncate();
  });

  it("should return 401 to unauthorized user", async () => {
    const res = await request(server).get("/classes");

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

    const res2 = await request(server)
      .get("/classes")
      .set("authorization", `${token}`);

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

    const res2 = await request(server)
      .get("/classes")
      .set("authorization", `${token}`);

    expect(res2.status).toBe(200);
    expect(res2.body).toEqual([]);
  });

  it("should return all classes in db to authorized user", async () => {
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

    // id should be a string!
    const testClass = [
      {
        id: "1",
        name: "Ms. Angela's",
        grade: "1st"
      }
    ];

    await db("class").insert(testClass);

    const res2 = await request(server)
      .get("/classes")
      .set("authorization", `${token}`);

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

  it("should return 401 to unauthorized user", async () => {
    const res = await request(server).get("/classes/1");

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

    let response = await request(server)
      .get("/classes/2")
      .set("authorization", `${token}`);

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

    it("should return 401 to unauthorized user", async () => {
      const res = await request(server).post("/classes");

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
        .set("authorization", `${token}`)
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
        name: "Ms. Patty's",
        grade: "1st"
      });

      expect(newClass).toEqual({
        id: "1",
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
        .set("authorization", `${token}`)
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
        .set("authorization", `${token}`)
        .send({ grade: "1st" });

      expect(response.status).toBe(422);
    });
  });

  //UPDATE
  describe("update Class", () => {
    beforeEach(async () => {
      await db("sessions").truncate();
      await db("class").truncate();
      await db("users").truncate();
    });

    it("should return 401 if user is unauthorized", async () => {
      const class1 = {
        id: "1",
        ref_id: 1,
        name: "Mrs. Jan's",
        grade: "6th"
      };

      await db("class").insert(class1);

      const updatedClass = [
        {
          id: "1",
          name: "Mrs. June's",
          grade: "6th"
        }
      ];

      let res2 = await request(server)
        .put("/classes/1")
        .send(updatedClass);

      expect(res2.status).toBe(401);
    });

    it("should return the updated class, to authorized user", async () => {
      let res = await request(server)
        .post("/register")
        .send({
          id: "3",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

      let token = res.body.token;

      const class1 = {
        id: "1",
        ref_id: 1,
        name: "Ms. Tino's",
        grade: "4th"
      };

      await db("class").insert(class1);

      const updatedClass = {
        id: "1",
        ref_id: 1,
        name: "Ms. Shelly's",
        grade: "4th"
      };

      let res2 = await request(server)
        .put("/classes/1")
        .set("authorization", `${token}`)
        .send(updatedClass);

      expect(res2.body.message).toEqual("The class has been updated");
      expect(res2.status).toBe(200);
    });

    it("should return 404 for no class with provided id", async () => {
      let res = await request(server)
        .post("/register")
        .send({
          id: "3",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

      let token = res.body.token;

      const updatedClass = {
        id: "1",
        ref_id: 1,
        name: "Ms. Tino's",
        grade: "4th"
      };

      let res1 = await request(server)
        .put("/classes/3")
        .set("authorization", `${token}`)
        .send(updatedClass);
      expect(res1.status).toBe(404);
    });
  });

  //DELETE
  describe("remove Classes", () => {
    afterEach(async () => {
      await db("sessions").truncate();
      await db("class").truncate();
      await db("users").truncate();
    });

    it("should return 401 if user is unauthorized", async () => {
      const class1 = {
        id: "1",
        ref_id: 1,
        name: "Mrs. Jan's",
        grade: "6th"
      };

      await db("class").insert(class1);

      let res = await request(server).delete("/classes/1");

      expect(res.status).toBe(401);
    });

    it("should delete class if user is authorized", async () => {
      afterEach(async () => {
        await db("users").truncate();
        await db("sessions").truncate();
        await db("class").truncate();
      });

      const class1 = {
        id: "1",
        ref_id: 1,
        name: "Mrs. Jan's",
        grade: "6th"
      };

      await db("class").insert(class1);

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
        .delete("/classes/1")
        .set("authorization", `${token}`);
      expect(response.status).toBe(200);
    });

    it("removeClass helper should delete class", async () => {
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
  });

  //GET CLASS SESSIONS
  describe("get Class Sessions", () => {
    beforeEach(async () => {
      //truncate clears db very fast, used in seeding
      await db("sessions").truncate();
      await db("class").truncate();
      await db("users").truncate();
    });

    it("get /classes/id/sesssions returns 401 if unauthorized", async () => {
      const res = await request(server).get("/classes/id/sessions");

      expect(res.status).toBe(401);
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
      await db("sessions").truncate();
      await db("class").truncate();
      await db("users").truncate();
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

      const body = { grade: "1st", id: "1", name: "Ms. Angela's" };

      let res = await request(server)
        .post("/register")
        .send({
          id: "3",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

      let token = res.body.token;

      let res2 = await request(server)
        .get("/classes/1")
        .set("authorization", `${token}`);

      expect(res2.status).toBe(200);
      expect(res2.body).toStrictEqual(body);
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

    it("should return 401 if user is unauthorized", async () => {
      const class1 = {
        id: "1",
        ref_id: 1,
        name: "Mrs. Jan's",
        grade: "6th"
      };

      await db("class").insert(class1);

      const user1 = [
        {
          id: "1",
          firstname: "Lisa",
          lastname: "Jones",
          username: "lijones",
          password: "test",
          email: "jones@gmail.com",
          role: "teacher"
        }
      ];

      await db("users").insert(user1);

      let res1 = await request(server).get("/classes/1/users");

      expect(res1.status).toBe(401);
    });

    it("returns class users if user is authorized", async () => {
      beforeEach(async () => {
        //truncate clears db very fast, used in seeding
        await db("sessions").truncate();
        await db("class").truncate();
        await db("users").truncate();
      });

      const class1 = {
        id: "1",
        ref_id: 1,
        name: "Mrs. Jan's",
        grade: "6th"
      };

      await db("class").insert(class1);

      const user1 = [
        {
          id: "1",
          ref_id: 1,
          firstname: "Lisa",
          lastname: "Jones",
          username: "lijones",
          password: "test",
          email: "jones@gmail.com",
          role: "teacher"
        }
      ];

      await db("users").insert(user1);

      const sessions = [
        {
          id: "1",
          user_id: 1,
          class_id: 1,
          date: "06/19/20",
          score: 90,
          lessonName: "Reading"
        }
      ];

      await db("sessions").insert(sessions);

      let res = await request(server)
        .post("/register")
        .send({
          id: "3",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

      let token = res.body.token;
      let body1 = [
        {
          id: "1",
          firstname: "Lisa",
          lastname: "Jones",
          email: "jones@gmail.com"
        }
      ];

      const res1 = await request(server)
        .get("/classes/1/users")
        .set("authorization", `${token}`);

      expect(res1.status).toBe(200);
      expect(res1.body).toStrictEqual(body1);
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

    it("returns empty array if no session stored", async () => {
      const score = await Classes.getClassUsers(1);

      expect(score).toEqual([]);
    });
  });
});