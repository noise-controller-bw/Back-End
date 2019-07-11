const express = require('express');

const db = require('../data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ api: 'up and running!' });
});

module.exports = server;