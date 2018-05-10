var express = require('express');
var Map = require('./model');

var app = express.Router();
var map = new Map();

app
    .get('/state', (req, res) => res.send(map))
    .post('/marker/create', (req, res) => res.send())
    .post('/marker/edit', (res, req) => res.send())
    ;

 module.exports = app;