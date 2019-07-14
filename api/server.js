const express = require('express');
const server = express();
const middleWareConfig = require('../config/middleware.js')

// const db = require('../data/dbConfig.js');

const { usersRouter } = require('./routes');

middleWareConfig(server);

server.use(express.json());

// routers
server.use('/users', usersRouter);

server.get('/', (req, res) => {
  res.status(200).json({ api: 'up and running!' });
});

module.exports = server;