const express = require('express');
const path = require('path');

var app = express();

const servername = "localhost";
const port = 8080;

app
    //body parsers here
    .use('/', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();      
    })
    .use('/', express.static(path.join(__dirname, "../dist/")))
    //seperate controllers here
    .use('/', (req, res, next) => {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
    })
    .listen(port);

console.log("running on http://" + servername + ":" + port)