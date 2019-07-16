const express = require("express");
const server = express();
const middleWareConfig = require("../config/middleware.js");

// const db = require('../data/dbConfig.js');

const {
  usersRouter,
  sessionsRouter,
  authRouter,
  classesRouter
} = require("./routes");

middleWareConfig(server);

// server.use(express.json());

// routers
server.use("/users", usersRouter);

server.use("/classes", classesRouter);

server.use("/sessions", sessionsRouter);

server.use("/", authRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "up and running!" });
});

module.exports = server;
