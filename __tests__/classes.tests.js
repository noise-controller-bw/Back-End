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
});
