const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { authenticate, generateToken } = require("../../auth/authenticate.js");

const { addUser, getUserByFilter } = require("../helpers");

// responds with saved user object and a token
router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  if (
    !user.firstname ||
    !user.lastname ||
    !user.username ||
    !user.password ||
    !user.email ||
    !user.role
  ) {
    return res.status(422).json({ message: "Please fill out missing fields!" });
  } else {
    addUser(user)
      .then(saved => {
        const token = generateToken(saved);
        res.status(201).json({saved, token});
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

//Todo: Add authenticate mw to ensure user is authenticated
// responds with user object, token and welcoming message
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ message: "Please fill out missing fields!" });
  } else {
    getUserByFilter({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome ${user.username}!`,
            token, user
          });
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

module.exports = router;
