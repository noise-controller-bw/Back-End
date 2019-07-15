const users = require('./usersHelper');
const classes = require('./classesHelper');

module.exports = {
    ...users,
    ...classes
}