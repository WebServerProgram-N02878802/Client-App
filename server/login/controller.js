const express = require('express');
const formidable = require('formidable');

var app = express.Router();

//TEST CONFIGURATION | change after deployed 
var username = "testuser";
var password = "testpass";


app
    .post('/verify', (req, res) => {
        if(req.body.username == username && req.body.password == password){
            console.log("Client logged...");
            res.send({ success: true });
        }
        else {
            console.log("Client declined...");
            res.send({ success: false });
        }
    })
    ;

module.exports = app;