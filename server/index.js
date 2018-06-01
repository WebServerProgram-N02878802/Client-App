const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const map = require('./map/controller');

var app = express();

const servername = "cs.newpaltz.edu"; //"localhost 137.140.4.187"
const port = 10010;

//	TEST IF INSTANCE RUNNING
var server = 
app
    //BODY PARSER
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use('/', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();      
    })

    //STATIC DIRECTORIES
    .use('/', express.static(path.join(__dirname, "../dist/")))//webpack files
    .use('/', express.static(path.join(__dirname, "../public/")))//map overlay image
    .use('/', express.static(path.join(__dirname, "../public/marker/images/")))//marker images
    .use('/', express.static(path.join(__dirname, "../public/marker/icons/")))//marker icons
    .use('/', express.static(path.join(__dirname, "../public/marker/audio/")))//marker audio

    //CONTROLLERS
    .use('/map', map)

    //DEFUALT
    .use('/', (req, res, next) => {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
    })
    .listen(port, function (){ //, servername
		console.log("Calling app.listen's callback function.");
		var host2 = server.address().address;
		var port2 = server.address().port;
		console.log('Example app listening at http://%s:%s', host2, port2);
	});
		

console.log("running on http://" + servername + ":" + port)
//	TEST IF INSTANCE RUNNING
console.log(server.address());