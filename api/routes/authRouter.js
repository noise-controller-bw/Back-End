// const router = require("express").Router();
// const bcrypt = require("bcryptjs");

// const { authenticate, tokenAuthen } = require("../../auth/authenticate.js");

// const { addUser, getUserByFilter } = require("../helpers");

// router.post("/register", (req, res) => {
//   let user = req.body;
//   const hash = bcrypt.hashSync(user.password, 10);
//   user.password = hash;

//   addUser(user)
//     .then(saved => {
//       res.status(201).json(saved);
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// });

// router.post("/login", (req, res) => {
//   let { username, password } = req.body;

//   getUserByFilter({ username })
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         const token = tokenAuthen.generateToken(user);
//         res.status(200).json({
//           message: `Welcome ${user.username}!`,
//           token
//         });
//       } else {
//         res.status(401).json({ message: "Invalid Credentials" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// });

// module.exports = router;
