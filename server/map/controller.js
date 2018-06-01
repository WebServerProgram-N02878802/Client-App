const express = require('express');
const mysql = require('mysql');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const Map = require('./model');

var app = express.Router();
var map = new Map();

var imgindex = 0;  //fix l8r
var mp3index = 0;
var iconindex = 0;

/*
    initialize markers from MySQL db
*/
/*
var con = mysql.createConnection({
    host: "localhost",
    user: "p_f18_1",
    password: "ik6bcl",
    database: "p_f18_1_db"
});

con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM marker;", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});
*/

app
    .get('/state', (req, res) => res.send({ success: true, map: map }))
    .post('/add', (req, res) => {
        //ADD MARKER TO SQL TABLE
        /*
        let m = req.body.marker;
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO markers (lat, lng, title, subtitle, description, image, audio) VALUES ( '" + m.Position.lat + "', '" + m.Position.lng + "', '" + m.Title + "', '" + m.Subtitle + "', '" + m.Description + "', '" + m.Image + "', '" + m.Audio + "');";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("*marker inserted into table*");
            });
        });
        */
        //add marker to JS model
        map.addMarker(req.body.marker);

        res.send({ success: true });
    })
    .post('/delete', (req, res) => {
        //DELETE MARKER IN SQL TABLE
        /*
        let m = map.Markers[req.body.index];
        con.connect(function (err) {
            if (err) throw err;
            var sql = "DELETE FROM markers WHERE lat = '" + m.Position.lat + "', lng = '" + m.Position.lng + "';";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Number of markers deleted: " + result.affectedRows);
            });
        });
        */
        //DELETE MARKER IN SERVER MODEL
        map.deleteMarker(req.body.index);

        res.send({ success: true });
    })
    .post('/edit', (req, res) => {
        //EDIT MARKER IN SQL TABLE
        /*
        let m = req.body.marker;
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "UPDATE markers SET title = '" + m.Title + "', subtitle = '" + m.Subtitle + "', description = '" + m.Description + "' WHERE lat = '" + m.Position.lat + "', lng = '" + m.Position.lng + "';";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });
        */
        //EDIT MARKER IN SERVER MODEL
        map.editMarker(req.body.index, req.body.marker);

        res.send({ success: true });
    })
    .post('/edit/image/add', (req, res) => {
        console.log("edit marker (add img)");
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let imgdir = path.join(__dirname, "../../public/marker/images/");
            let imgname = "";

            if (path.extname(file.name).toLowerCase() === '.png')
                imgname = "image" + imgindex++ + ".png";
            else if (path.extname(file.name).toLowerCase() === 'jpg')
                imgname = "image" + imgindex++ + ".jpg";
            else if (path.extname(file.name).toLowerCase() === 'jpeg')
                imgname = "image" + imgindex++ + ".jpeg";
            else {
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("error: \n" + err);
                });
                return res.send({ success: false });
            }

            //WRITE TO FS (assumes all 'fields' are parsed before any 'files')
            fs.renameSync(file.path, imgdir + imgname, (err) => {
                if (err) console.log("error: \n" + err);
            });

            //ADD IMAGE TO SQL TABLE
            /*
            let m = map.Markers[req.body.index];
            con.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");
                var sql = "UPDATE markers SET image = '" + imgdir + imgname + "' WHERE lat = '" + m.Position.lat + "', lng = '" + m.Position.lng + "';";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
            });
            */
            //ADD IMAGE TO SERVER MODEL
            map.editMarkerAddImg(index, imgdir, imgname);

            return res.send({ success: true, dir: imgdir, name: imgname });
        });
        form.on('field', (name, value) => {
            console.log("*field: " + name + "*");
            console.log("*value: " + value + "*");
            console.log(name == 'index');
            if (name == 'index')
                index = Number(value);
        });
        form.on('error', (err) => {
            console.log("error: \n" + err);
            return res.send({ success: false });
        });
        form.on('aborted', (err) => {
            console.log("error: \n" + err);
            return res.send({ success: false });
        });
        form.parse(req);
    })
    .post('/edit/icon/add', (req, res) => {
        console.log("edit marker (add icon)");
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let icondir = path.join(__dirname, "../../public/marker/icons/");
            let iconname = "";

            if (path.extname(file.name).toLowerCase() === '.png')
                iconname = "icon" + iconindex++ + ".png";
            else if (path.extname(file.name).toLowerCase() === 'jpg')
                iconname = "icon" + iconindex++ + ".jpg";
            else if (path.extname(file.name).toLowerCase() === 'jpeg')
                iconname = "icon" + iconindex++ + ".jpeg";
            else {
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("error: \n" + err);
                });
                return res.send({ success: false });
            }

            //WRITE TO FS (assumes all 'fields' are parsed before any 'files')
            fs.renameSync(file.path, icondir + iconname, (err) => {
                if (err) console.log("error: \n" + err);
            });

            //ADD IMAGE TO SQL TABLE
            /*
            let m = map.Markers[req.body.index];
            con.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");
                var sql = "UPDATE markers SET image = '" + imgdir + imgname + "' WHERE lat = '" + m.Position.lat + "', lng = '" + m.Position.lng + "';";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
            });
            */
            //ADD IMAGE TO SERVER MODEL
            map.editMarkerAddIcon(index, icondir, iconname);

            return res.send({ success: true, dir: icondir, name: iconname });
        });
        form.on('field', (name, value) => {
            console.log("*field: " + name + "*");
            console.log("*value: " + value + "*");
            console.log(name == 'index');
            if (name == 'index')
                index = Number(value);
        });
        form.on('error', (err) => {
            console.log("error: \n" + err);
            return res.send({ success: false });
        });
        form.on('aborted', (err) => {
            console.log("error: \n" + err);
            return res.send({ success: false });
        });
        form.parse(req);
    })
    .post('/edit/mp3/add', (req, res) => {
        console.log("edit marker (add mp3)");
        let form = new formidable.IncomingForm();

        form.on('file', (name, file) => {
            let mp3dir = path.join(__dirname, "../../public/marker/audio/");
            let mp3name = "";

            if (path.extname(file.name).toLowerCase() === '.mp3')
                mp3name = mp3index++ + ".mp3";
            else {
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("error: \n" + err);
                });
                return res.send({ success: false });
            }

            //WRITE TO FS (assumes all 'fields' are parsed before any 'files')
            fs.renameSync(file.path, mp3dir + mp3name, (err) => {
                if (err) console.log("error: \n" + err);
            });
            
            //ADD AUDIO TO SQL TABLE
            /*
            let m = map.Markers[req.body.index];
            con.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");
                var sql = "UPDATE markers SET audio = '" + mp3dir + mp3name + "' WHERE lat = '" + m.Position.lat + "', lng = '" + m.Position.lng + "';";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
            });
            */
            //ADD AUDIO TO SERVER MODEL
            map.editMarkerAddMp3(index, mp3dir, mp3name);

            return res.send({ success: true, dir: mp3dir, name: mp3name });
        });
        form.on('field', (name, value) => {
            console.log("*field: " + name + "*");
            console.log("*value: " + value + "*");
            if (name == 'index')
                index = Number(value);
        });
        form.on('error', (err) => {
            console.log("error: \n" + err);
            return res.send({ success: false });
        });
        form.on('aborted', (err) => {
            console.log("error: \n" + err);
            return res.send({ success: false });
        });
        form.parse(req);
    })
    ;

module.exports = app;