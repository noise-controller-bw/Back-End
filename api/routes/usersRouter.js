const { getAllUsers, getUserById, getUserByFilter, addUser, deleteUser, updateUser } = require('../helpers');
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

/*
GET route for `/users/:id`
TODO: Add middleware to ensure user is logged in
ROUTE = '/users/:id'
RETURNS user object
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

router.get('/:id', (req, res) => {
    getUserById(req.params.id.toString())
      .then(user => {
        if (user) {
            res.status(200).json(user);
          } else {
            res.status(400).json({ message: "There's no user with this id"})
          }
      })
      .catch(err => res.send(err));
});

/* POST
TODO: Add middleware to ensure user is logged in
ROUTE = '/users'
RETURNS user object
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

router.post('/', (req, res) => {
    const { firstname, lastname, username, password, email, role } = req.body;
    if (!firstname || !lastname || !username || !password || !email || !role) {
      return res.status(422).json({ error: 'fill out required fields!' });
    } else {
      const newUser = { firstname, lastname, username, password, email, role };
      addUser(newUser)
        .then(users => {
            res.status(201).json(users);
        })
        .catch(error => {
            res.status(500).json(error);
        });
    }
});

// @TODO: GET route for `/users/:id/classrooms

// DELETE for `/users/:id`
router.delete('/:id', async (req, res) => {
    try {
        const count = await deleteUser(req.params.id.toString());
        if (count > 0) {
          res.status(200).json({ message: 'The user has been deleted' });
        } else {
          res.status(404).json({ message: 'The user could not be found' });
        }
      } catch (error) {
        res.status(500).json({
          message: 'Error removing the user', error
        });
      }
});

// PUT for `/users/:id`
router.put('/:id', async (req, res) => {
    try {
        const user = await updateUser(req.params.id.toString(), req.body);
        if (user) {
          res.status(200).json({ message: 'The user has been updated' });
        } else {
          res.status(404).json({ message: 'The user could not be found' });
        }
      } catch (error) {
        res.status(500).json({
          message: 'Error updating the user', error
        });
      }
});

module.exports = router;