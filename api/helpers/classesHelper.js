const db = require("../../data/dbConfig.js");
const uuid = require("uuid/v4");

module.exports = {
  getAllClasses,
  getClassById,
  addClass,
  updateClass,
  removeClass,
  getClassScore
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

function getClassScore(id) {
  return db("sessions as s")
    .join("class as c", "c.ref_id", "s.class_id")
    .join("users as u", "u.ref_id", "s.user_id")
    .select(
      "s.id",
      "c.name as className",
      "s.lessonName",
      "c.grade",
      "s.date",
      "s.score"
    )
    .where("s.id", id);
}
