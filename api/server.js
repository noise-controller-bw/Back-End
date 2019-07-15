const express = require("express");
const server = express();
const middleWareConfig = require("../config/middleware.js");

// const db = require('../data/dbConfig.js');

const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { authenticate, generateToken } = require("../auth/authenticate.js");

const { addUser, getUserByFilter } = require("./helpers/usersHelper.js");

const { usersRouter, sessionsRouter } = require("./routes");

middleWareConfig(server);

server.use(express.json());

// routers
server.use("/users", usersRouter);

server.use("/sessions", sessionsRouter);

server.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  addUser(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/login", (req, res) => {
  let { username, password } = req.body;

  getUserByFilter({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/", (req, res) => {
  res.status(200).json({ api: "up and running!" });
});

module.exports = server;
