const {
  getAllClasses,
  getClassById,
  addClass,
  updateClass,
  removeClass,
  getClassSession,
  getClassUsers
} = require("../helpers");

const router = require("express").Router();

const { authenticate } = require("../../auth/authenticate.js");
const { checkRole } = require("../../MiddleWare/checkRole.js");

/*
GET ROUTE
TODO: Add middleware to ensure user is logged in
ROUTE = '/classes'
RETURNS an array of classes or an empry array if there's no classes in the class db
@class object = {
    id: "1", // id is a string!
    name: "Ms. Angela's",
    grade: "1st" // not required
}
*/

router.get("/", async (req, res) => {
  try {
    const allClasses = await getAllClasses();
    if (allClasses) {
      return res.status(200).json(allClasses);
    } else {
      res.status(400).send({ message: "Classes not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

/*
GET BY ID ROUTE
TODO: Add middleware to ensure user is logged in
ROUTE = '/classes/:id'
RETURNS class object
@class object = {
    id: "1", // id is a string!
    name: "Ms. Angela's",
    grade: "1st" // not required
}
*/
router.get("/:id", (req, res) => {
  getClassById(req.params.id.toString())
    .then(classById => {
      if (classById) {
        res.status(200).json(classById);
      } else {
        res.status(400).json({ message: "There's no class with this id" });
      }
    })
    .catch(err => res.send(err));
});

/* POST
TODO: Add middleware to ensure user is logged in
ROUTE = '/classes'
RETURNS class object
@class object = {
    id: "1", // id is a string!
    name: "Ms. Angela's",
    grade: "1st" // not required
}
*/
router.post("/", (req, res) => {
  const { name, grade } = req.body;
  if (!name) {
    return res.status(422).json({ error: "fill out required `name` field!" });
  } else {
    const newClass = { name, grade };
    addClass(newClass)
      .then(resClasses => {
        res.status(201).json(resClasses);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

/* PUT/ UPDATE
TODO: Add middleware to ensure user is logged in
ROUTE = '/classes/:id'
RETURNS class updated object
@class updated object = {
    id: "1", // id is a string!
    name: "Ms. Angela's",
    grade: "1st" // not required
}
*/
router.put("/:id", async (req, res) => {
  try {
    const updatedClasses = {
      id: req.params.id.toString(),
      ...req.body
    };
    const classes = await updateClass(req.params.id.toString(), req.body);
    if (classes) {
      res
        .status(200)
        .json({ message: "The class has been updated", updatedClasses });
    } else {
      res.status(404).json({ message: "The class could not be found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating the class",
      error
    });
  }
});

/* DELETE
TODO: Add middleware to ensure user is logged in, Role verify required?
ROUTE = '/classes/:id'

*/
const t = "teacher";

router.delete("/:id", authenticate, checkRole("admin"), async (req, res) => {
  try {
    const count = await removeClass(req.params.id.toString());
    if (count > 0) {
      res.status(200).json({ message: "The class has been deleted", count });
    } else {
      res.status(404).json({
        message: "That class does not exist"
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "We ran into an error removing the class" });
  }
});

//CLASSES/ID/SESSIONS
router.get("/:id/sessions", (req, res) => {
  getClassSession(req.params.id.toString())
    .then(sess => {
      if (sess) {
        return res.status(200).json(sess);
      } else {
        res
          .status(400)
          .send({ message: "Sessions for this class is not found" });
      }
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

//CLASSES/ID/USERS
router.get("/:id/users", (req, res) => {
  getClassUsers(req.params.id.toString())
    .then(users => {
      if (users) {
        return res.status(200).json(users);
      } else {
        res.status(400).send({ message: "Users for this class is not found" });
      }
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

module.exports = router;