const { getAllUsers } = require('../helpers');
const router = require('express').Router();

/*
GET ROUTE
TODO: Add middleware to ensure user is logged in
ROUTE = '/users'
RETURNS an array of users
@user object = {
    id: "1",
                firstname: "Lisa",
                lastname: "Jones",
                username: "lijones",
                password: "test",
                email: "jones@gmail.com",
                role: "teacher"
}
*/

router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers()
        if (users) {
            return res.status(200).json(users)
        } else {
            res.status(400).send({ message: 'Users not found' })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
});

// GET route for `/users/:id`

// @TO-DO: GET route for `/users/:id/classrooms

// DELETE for `/users/:id`

// PUT for `/users/:id`


module.exports = router;