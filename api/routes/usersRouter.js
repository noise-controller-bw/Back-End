const {
  getAllUsers,
  getUserById,
  getUserByFilter,
  getSessionsByUserId,
  getClassesByUserId,
  addUser,
  deleteUser,
  updateUser
} = require("../helpers");

const router = require("express").Router();

// middleware
const { authenticate } = require("../../auth/authenticate.js");
const { checkRole } = require("../../MiddleWare/checkRole.js");

/*
GET ROUTE
ROUTE = '/users'
RETURNS an array of users
@user object = {
    id: "1", // id is a string!
    firstname: "Lisa",
    lastname: "Jones",
    username: "lijones",
    email: "jones@gmail.com",
    role: "teacher"
}
*/

router.get("/", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const users = await getAllUsers();
    if (users) {
      return res.status(200).json(users);
    } else {
      res.status(400).send({ message: "Users not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

/*
GET BY ID ROUTE
ROUTE = '/users/:id'
RETURNS user object
@user object = {
    id: "1", // id is a string!
    firstname: "Lisa",
    lastname: "Jones",
    username: "lijones",
    email: "jones@gmail.com",
    role: "teacher"
}
*/

router.get("/:id", authenticate, (req, res) => {
  getUserById(req.params.id.toString())
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "There's no user with this id" });
      }
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/*
GET SESSIONS BY USER ID
ROUTE = '/users/:id/sessions' where id = user id
RETURNS an array of session objects
@session object = {
    id: "1", // id of the session not user
    first_name: "Alan", // users' first name
    last_name: "Turing", // users' last name
    date: "03/07/1984",
    score: "100",
    subject: "Math", // === lesson_name
    class_name: "Ms. Angela's",
    grade: "1st"
}
*/

router.get("/:id/sessions", authenticate, (req, res) => {
  getSessionsByUserId(req.params.id.toString())
    .then(sessions => {
      if (sessions) {
        return res.status(200).json(sessions);
      } else {
        res.status(400).send({ message: "Sessions for this user not found" });
      }
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/*
GET CLASSES BY USER ID
ROUTE = '/users/:id/classes' where id = user id
RETURNS an array of unique classes objects, classes which had sessions with particular user, NOT ALL CLASSES FROM THE DB!!!
@session object = {
    id: "1",
    class_name: "Ms. Angela's",
    grade: "1st"
}
*/

router.get("/:id/classes", authenticate, (req, res) => {
  getClassesByUserId(req.params.id.toString())
    .then(classes => {
      if (classes) {
        return res.status(200).json(classes);
      } else {
        res.status(400).send({ message: "Classes for this user not found" });
      }
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/* POST
ROUTE = '/users'
RETURNS user object
@user object = {
    id: "1", // id is a string!
    firstname: "Lisa",
    lastname: "Jones",
    username: "lijones",
    email: "jones@gmail.com",
    role: "teacher"
}
*/

router.post("/", authenticate, (req, res) => {
  let { firstname, lastname, username, password, email, role } = req.body;
  if (!firstname || !lastname || !username || !password || !email) {
    return res.status(422).json({ error: "fill out required fields!" });
  } else {
    if(role === undefined) {
      role = "teacher";
    }
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

/* 
DELETE for `/users/:id`
ROUTE = '/users/:id'
RETURNS message (success or failure) and count (how many records has been deleted)
@success_object = {
    "message": "The user has been deleted",
    "count": 1
}
@failure_object = {
    "message": "The user could not be found"
}
*/

router.delete("/:id", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const count = await deleteUser(req.params.id.toString());
    if (count > 0) {
      res.status(200).json({ message: "The user has been deleted", count });
    } else {
      res.status(404).json({ message: "The user could not be found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error removing the user",
      error
    });
  }
});

/*
PUT for `/users/:id`
ROUTE = '/users/:id'
RETURNS message (success or failure) and updatedUser object
@success_object = {
    "message": "The user has been updated",
    "updatedUser": {
        "id": "0cd99de2-bcc3-4c3e-8915-f6866ad234c7", // id is a string!
        "firstname": "Liz",
        "lastname": "Jo",
        "username": "lijones",
        "email": "jones@gmail.com",
    }
}
@failure_object = {
    "message": "The user could not be found"
}
*/
router.put("/:id", authenticate, async (req, res) => {
  try {
    const updatedUser = {
      id: req.params.id.toString(),
      ...req.body
    };
    const user = await updateUser(req.params.id.toString(), req.body);
    if (user) {
      res
        .status(200)
        .json({ message: "The user has been updated", updatedUser });
    } else {
      res.status(404).json({ message: "The user could not be found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating the user",
      error
    });
  }
});

module.exports = router;