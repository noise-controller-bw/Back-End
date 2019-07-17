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

function findSessionsById(SessId) {
  return db("sessions as s")
    .join("users as u", "u.ref_id", "s.user_id")
    .join("class as c", "c.ref_id", "s.class_id")
    .select(
      "s.id",
      "u.firstname",
      "u.lastname",
      "s.date",
      "s.lessonName",
      "c.name as className",
      "c.grade",
      "s.score"
    )
    .where("s.id", SessId);
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
