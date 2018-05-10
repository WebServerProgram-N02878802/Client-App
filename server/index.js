const express = require('express');
const path = require('path');

const map = require('./map/controller');

var app = express();

const servername = "localhost";
const port = 8080;

app
    //body parsers & console logs here
    .use('/', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();      
    })
    .use('/', express.static(path.join(__dirname, "../dist/")))
    
    app.use(express.static('public'))
    //seperate controllers here
    .use('/map', map)

    //potentially unnecessary [angular routes index to /map]
    .use('/', (req, res, next) => {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
    })
    .listen(port);

console.log("running on http://" + servername + ":" + port)