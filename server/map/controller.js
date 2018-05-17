var express = require('express');
var Map = require('./model');

var app = express.Router();
var map = new Map();

app
    .get('/state', (req, res) => res.send(map))
    .post('/add', (req, res) => res.send(map.addMarker(req.body.marker)))
    .post('/edit', (req, res) => res.send(map.editMarker(req.body.marker)))
    .post('/del', (req, res) => res.send(map.delMarker(req.body.marker)))
    ;

 module.exports = app;