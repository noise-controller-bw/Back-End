const db = require('../../data/dbConfig.js');
const uuid = require('uuid/v4');

module.exports = {
    getAllUsers,
    getUserById,
    getUserByFilter,
    addUser,
    deleteUser
};

// helpers functions

// GET ALL users
// Must return all users or empty array
function getAllUsers() {
    return db('users');
}

// GET user by ID
// Must return user object
function getUserById(id) {
    return db('users')
        .where({ id })
        .first()
}

// GET user by FILTER
// Must return user object
function getUserByFilter(filter) {
    return db('users').where(filter).first();
}

// ADD user to the db, id is randomly created with uuid
// returns user id (ID IS A STRING!!!)
async function addUser(user) {
    const newUser = { id: uuid(), ...user };
    const id = await db('users')
        .insert(newUser)
        .then(res => {
            return newUser.id;
        });
    return getUserById(id);
}

// EDIT user

// DELETE user
function deleteUser(id) {
    return db('users')
      .where({id })
      .del();
  }

//@TO-DO: GET all SESSIONS by userId