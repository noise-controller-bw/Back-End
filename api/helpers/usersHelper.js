const db = require('../../data/dbConfig.js');

module.exports = {
    //helpers exports
    getAllUsers
};

// helpers functions

// GET ALL users
// Must return all users or empty array
function getAllUsers() {
    return db('users');
}

// GET user by ID
// Must return user object

// GET user by FILTER
// Must return user object

// ADD user

// EDIT user

// DELETE user

//@TO-DO: GET all SESSIONS by userId