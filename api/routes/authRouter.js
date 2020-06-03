const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { authenticate, generateToken } = require("../../auth/authenticate.js");

const { addUser, getUserByFilter } = require("../helpers");

// responds with saved user object and a token
router.post("/register", (req, res) => {
  let user = req.body;


  // HASH PW BEFORE SAVING TO DB
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

        // we want to have an option to access restricted routes right after registration
        //SEND BACK TOKEN TO CLIENT AFTER REGISTRATION SUCCESSFUL
        res.status(201).json({ user: myUser, token });
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

//VERIFY PW USING BCRYPT
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ message: "Please fill out missing fields!" });
  } else {
    getUserByFilter({ username })
      .first()
      .then(user => {

        //GET THE HASHED PW SAVED FOR THIS USER FROM OUR DB (getUserByFilter)

        //COMPARE GIVEN PW & BCRYPT HASHED PW SAVED IN DB
        if (user && bcrypt.compareSync(password, user.password)) {

          //IF BCYRPT HASHED PW & GIVNEN PW ARE == EQUAL
          //GENERATE A TOKEN WITH HEADER, PAYLOAD & SIGNATURE
          const token = generateToken(user);

          // we don't want to send back to user some info like hashed password or ref_id which we're using only internally
          let { id, firstname, lastname, username, email, role } = user;
          const myUser = { id, firstname, lastname, username, email, role };


          //RETURN TOKEN TO CLIENT FOR USE IN CLIENT REQUEST HEADERS
          //CLIENT CAN STORE THIS TOKEN IN LOCAL STORAGE TO USE IN SESSIONS/PERSIST AUTH INFO ACROSS REQUESTS
          //CAN REMOVE TOKEN FROM LOCAL STORAGE AFTER LOG-OUT          
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
