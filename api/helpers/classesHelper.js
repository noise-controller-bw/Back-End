const db = require("../../data/dbConfig.js");
const uuid = require("uuid/v4");

module.exports = {
  getAllClasses,
  getClassById,
  addClass,
  updateClass,
  removeClass,
  getClassSession,
  getClassUsers
};

// GET ALL classes
// Must return all classes or empty array
function getAllClasses() {
  return db("class");
}

// GET class by ID
// Must return class object
function getClassById(id) {
  return db("class")
    .where({ id })
    .first();
}

// ADD class to the db, id is randomly created with uuid
// returns class id (ID IS A STRING!!!)
async function addClass(classObj) {
  const newClass = { id: uuid(), ...classObj };
  const id = await db("class")
    .insert(newClass)
    .then(res => {
      return newClass.id;
    });
  return getClassById(id);
}

function updateClass(id, changes) {
  return db("class")
    .where({ id })
    .update(changes);
}

function removeClass(id) {
  return db("class")
    .where({ id })
    .del();
}

function getClassSession(id) {
  return db("class as c")
    .join("sessions as s", "c.ref_id", "s.class_id")
    .join("users as u", "s.user_id", "u.ref_id")
    .select(
      "s.id",
      "u.firstname",
      "u.lastname",
      "s.lessonName ",
      "s.date",
      "s.score"
    )
    .where("c.id", id);
}

function getClassUsers(id) {
  return db("class as c")
    .join("sessions as s", "c.ref_id", "s.class_id")
    .join("users as u", "s.user_id", "u.ref_id")
    .select(
      "u.id",
      "u.firstname",
      "u.lastname",
      "c.name as className",
      "c.grade",
      "s.lessonName"
    )
    .where("c.id", id);
}
