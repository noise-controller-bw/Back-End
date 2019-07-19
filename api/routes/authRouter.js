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
    !user.email
  ) {
    return res.status(422).json({ message: "Please fill out missing fields!" });
  } else {
    addUser(user)
      .then(saved => {
        // we want to have an option to access restricted routes right after registration
        const token = generateToken(saved);

        // we don't want to send back to user some info like hashed password or ref_id which we're using only internally
        let { id, firstname, lastname, username, email, role } = saved;
        const myUser = { id, firstname, lastname, username, email, role };

        res.status(201).json({ user: myUser, token });
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

          // we don't want to send back to user some info like hashed password or ref_id which we're using only internally
          let { id, firstname, lastname, username, email, role } = user;
          const myUser = { id, firstname, lastname, username, email, role };

          res.status(200).json({
            message: `Welcome ${username}!`,
            token,
            user: myUser
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
