const request = require("supertest");
const server = require("../api/server.js");

const db = require("../data/dbConfig.js");
const Classes = require("../api/helpers/classesHelper.js");

// GET

describe("GET /classes", () => {
  // cleanup for db
  afterEach(async () => {
    await db("class").truncate();
  });

  it("should return 200", async () => {
    const res = await request(server).get("/classes");
    expect(res.status).toBe(200);
  });

  it("should return classes", async () => {
    const res = await request(server).get("/classes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return all classes in db", async () => {
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

    const res = await request(server).get("/classes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(testClass);
  });
});

// GET by Id

describe("getClassById", () => {
  // cleanup for db
  afterEach(async () => {
    await db("class").truncate();
  });

  it("finds a class by id", async () => {
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

  it("returns undefined of invalid id", async () => {
    const myClass = await Classes.getClassById("2");

    expect(myClass).toBeUndefined();
  });

  // POST

  describe("addClass", () => {
    // cleanup for db
    afterEach(async () => {
      await db("class").truncate();
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

    it("should return a status code of 201", async () => {
      let response = await request(server)
        .post("/classes")
        .send({
          id: "1",
          name: "Ms. Jen's",
          grade: "1st"
        });

      expect(response.status).toBe(201);
    });

    it("should return the new class on insert", async () => {
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

    it("should return a `422` status code if name field is not included inside the body", async () => {
      let response = await request(server)
        .post("/classes")
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
    it("should delete a class", async () => {
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
});
