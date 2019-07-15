const db = require("../../data/dbConfig.js");
const uuid = require("uuid/v4");

module.exports = {
  findSessions,
  findSessionsById,
  getSessionsByFilter,
  addSessions,
  updateSessions,
  removeSessions
};

function findSessions() {
  return db("sessions").select("id", "date", "score", "lessonName");
}

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
}

function removeSessions(id) {
  return db("sessions")
    .where({ id })
    .del();
}
