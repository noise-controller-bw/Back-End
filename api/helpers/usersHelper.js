const db = require('../../data/dbConfig.js');

module.exports = {
    getAllUsers,
    getUserById
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

// ADD user

// EDIT user

// DELETE user

//@TO-DO: GET all SESSIONS by userId