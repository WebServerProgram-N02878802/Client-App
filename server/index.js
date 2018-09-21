const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const map = require('./map/controller');
const login = require('./login/controller');

var app = express();

const servername = "cs.newpaltz.edu"; //"cs.newpaltz.edu" "localhost"
const port = 10010; //8080

app
    //BODY PARSER
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use("/", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();      
    })

    //STATIC DIRECTORIES
    .use("/", express.static(path.join(__dirname, "../dist/")))//webpack files
    .use("/", express.static(path.join(__dirname, "../public/")))//map overlay image
    .use("/", express.static(path.join(__dirname, "../public/marker/images/")))//marker images
    .use("/", express.static(path.join(__dirname, "../public/marker/icons/")))//marker icons
    .use("/", express.static(path.join(__dirname, "../public/marker/markericon/")))//marker icons
    .use("/", express.static(path.join(__dirname, "../public/marker/audio/")))//marker audio

    //CONTROLLERS
    .use('/map', map)
    .use('/login', login)

    //DEFUALT
    .use("/", (req, res, next) => {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
    })
    .listen(port, function (){
        //TEST IF INSTANCE IS RUNNING
		console.log("Calling app.listen's callback function.");
	});
		

console.log("running on http://" + servername + ":" + port)