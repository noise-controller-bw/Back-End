const db = require("../../data/dbConfig.js");
const uuid = require("uuid/v4");

module.exports = {
  findSessions,
  findSessionsById,
  getSessionsByFilter,
  addSessions,
  updateSessions,
  removeSessions
  //   findByRole
  //   getRecipeIngredients,
  //   getRecipe
};

//find teacher with just first & last name
//get('users')
function findSessions() {
  return db("sessions").select("id", "date", "score", "lessonName");
}

//find sessions with  class name, session scores & highest score
//get ('sessions')
// function findSessions() {
//   return db("sessions as p")
//     .join("class as u", "u.id", "p.class_id") //need this join here?
//     .select("p.id", "p.date", "p.score", "p.HighestScore", "p.className");
// }

//find teacher by id
function findSessionsById(id) {
  return db("sessions")
    .where({ id })
    .first();
}

function getSessionsByFilter(filter) {
  return db("sessions")
    .where(filter)
    .first();
}

async function addSessions(sessions) {
  const newSession = { id: uuid(), ...sessions };
  const id = await db("sessions")
    .insert(newSession)
    .then(res => {
      return newSession.id;
    });
  return findSessionsById(id);
}

function updateSessions(id, changes) {
  return db("sessions")
    .where({ id })
    .update(changes);
  // .then(count => {
  //   if (count > 0) {
  //     return findById(id);
  //   } else {
  //     return null;
  //   }
  // });
}

function removeSessions(id) {
  return db("sessions")
    .where({ id })
    .del();
}

// function findByRole(decodedRole) {
//   return db("sessions").where("role", decodedRole);
// }
