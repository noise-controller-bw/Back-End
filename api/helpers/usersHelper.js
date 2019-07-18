const db = require("../../data/dbConfig.js");
const uuid = require("uuid/v4");

module.exports = {
  getAllUsers,
  getUserById,
  getUserByFilter,
  getSessionsByUserId,
  getClassesByUserId,
  addUser,
  updateUser,
  deleteUser
};

// helpers functions

// GET ALL users
// Must return all users or empty array
function getAllUsers() {
  return db("users");
}

// GET user by ID
// Must return user object
function getUserById(id) {
  return db("users")
    .where({ id })
    .first();
}

// GET user by FILTER
// Must return user object
function getUserByFilter(filter) {
  return db("users")
    .where(filter)
    .first();
}

// GET sessions by USER ID
// Must return an array of objects
function getSessionsByUserId(user_id) {
  return db("users as u")
    .join("sessions as s", "u.ref_id", "s.user_id")
    .join("class as c", "s.class_id", "c.ref_id")
    .select(
      "s.id",
      "s.date",
      "s.score",
      "s.lessonName",
      "c.name",
      "c.grade"
    )
    .where("u.id", user_id);
}

// GET classes by user id
// returns UNIQUE classes which had sessions with particular user, NOT ALL CLASSES FROM THE DB!!!

function getClassesByUserId(user_id) {
  return db("users as u")
    .join("sessions as s", "u.ref_id", "s.user_id")
    .join("class as c", "s.class_id", "c.ref_id")
    .select("c.id", "c.name", "c.grade")
    .distinct()
    .where("u.id", user_id);
}

// ADD user to the db, id is randomly created with uuid
// returns user id (ID IS A STRING!!!)
async function addUser(user) {
  const newUser = { id: uuid(), ...user };
  const id = await db("users")
    .insert(newUser)
    .then(res => {
      return newUser.id;
    });
  return getUserById(id);
}

// EDIT user
function updateUser(id, changes) {
  return db("users")
    .where({ id })
    .update(changes);
}

// DELETE user
function deleteUser(id) {
  return db("users")
    .where({ id })
    .del();
}

//@TO-DO: GET all SESSIONS by userId
