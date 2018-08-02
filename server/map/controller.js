const express = require('express');
const mysql = require('mysql');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const Map = require('./model');

var app = express.Router();
var map = new Map();

var imgindex = 0;
var mp3index = 0;
var iconindex = 0;
var markericonindex = 0;



/*
    INITIALIZE SERVER MODEL W/ MySQL DATA
*/
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
        if (result != undefined) {
            for (var i in result) {
                map.initMarker(result[i].lat, result[i].lng, result[i].title, result[i].subtitle, result[i].description, result[i].image, result[i].icon, result[i].audio, result[i].markericon);
            }
        }
    });
    con.query("SELECT * FROM map;", function (err, result) {
        if (err) throw err;
        if (result != undefined) {
            map.editPosition({ lat: result[0].lat, lng: result[0].lng });
            map.editZoom(result[0].zoom);
            imgindex = result[0].imgindex++;
            mp3index = result[0].mp3index++;
            iconindex = result[0].iconindex++;
            markericonindex = result[0].markericonindex++;
        }
    });
});






app
    .get('/state', (req, res) => res.send({ success: true, map: map }))
    .post('/center', (req, res) => {
        //SET MAP CENTER POSITION
        var sql = "UPDATE map SET lat = ?, lng = ?, zoom = ? WHERE id = '1';";
        var inserts = [req.body.position.lat, req.body.position.lng, req.body.zoom];
        sql = mysql.format(sql, inserts);
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        map.editPosition(req.body.position);
        map.editZoom(req.body.zoom);
        res.send({ success: true });
    })
    .post('/add', (req, res) => {
        //ADD MARKER TO MAP
        let m = req.body.marker;
        var sql = "INSERT INTO marker (lat, lng, title, subtitle, description, image, icon, audio, markericon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        var inserts = [m.Position.lat, m.Position.lng, m.Title, m.Subtitle, m.Description, m.Image, m.Icon, m.Audio, m.MarkerIcon];
        sql = mysql.format(sql, inserts);
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        map.addMarker(req.body.marker);
        res.send({ success: true });
    })
    .post('/delete', (req, res) => {
        //DELETE MARKER FROM MAP
        let m = map.Markers[req.body.index];
        var sql = "DELETE FROM marker WHERE lat = ? AND lng = ?;";
        var inserts = [m.Position.lat, m.Position.lng];
        sql = mysql.format(sql, inserts);
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        map.deleteMarker(req.body.index);
        res.send({ success: true });
    })
    .post('/drag', (req, res) => {
        //UPDATE MARKER POSITION
        let m = map.Markers[req.body.index];
        var sql = "UPDATE marker SET lat = ?, lng = ? WHERE lat = ? AND lng = ?;";
        var inserts = [req.body.position.lat, req.body.position.lng, m.Position.lat, m.Position.lng];
        sql = mysql.format(sql, inserts);
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        map.dragMarker(req.body.index, req.body.position);
        res.send({ success: true });
    })
    .post('/edit', (req, res) => {
        //EDIT MARKER TEXT DETAILS
        let m = req.body.marker;
        var sql = "UPDATE marker SET title = ?, subtitle = ?, description = ? WHERE lat = ? AND lng = ?;";
        var inserts = [m.Title, m.Subtitle, m.Description, m.Position.lat, m.Position.lng];
        sql = mysql.format(sql, inserts);
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        map.editMarker(req.body.index, req.body.marker);
        res.send({ success: true });
    })
    .post('/edit/image/add', (req, res) => {
        //ADD IMAGE TO MARKER
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let imgdir = path.join(__dirname, "../../public/marker/images/");
            let imgname = "";
            if (path.extname(file.name).toLowerCase() === '.png')
                imgname = "image" + imgindex++ + ".png";
            else if (path.extname(file.name).toLowerCase() === '.jpg')
                imgname = "image" + imgindex++ + ".jpg";
            else if (path.extname(file.name).toLowerCase() === '.jpeg')
                imgname = "image" + imgindex++ + ".jpeg";
            else {
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("error: \n" + err);
                });
                return res.send({ success: false });
            }
            fs.renameSync(file.path, imgdir + imgname, (err) => {
                if (err) {
                    console.log("error: \n" + err);
                    return res.send({ success: false });
                }
            });
            let m = map.Markers[index];
            var sql = "UPDATE marker SET image = ? WHERE lat = ? AND lng = ?;";
            var inserts = [imgname, m.Position.lat, m.Position.lng];
            sql = mysql.format(sql, inserts);
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            sql = "UPDATE map SET imgindex = '" + imgindex++ + "' WHERE id = '1';";
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            map.editMarkerAddImg(index, imgdir, imgname);
            return res.send({ success: true, dir: imgdir, name: imgname });
        });

        form.on('field', (name, value) => {
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
        //ADD ICON TO MARKER
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let icondir = path.join(__dirname, "../../public/marker/icons/");
            let iconname = "";
            if (path.extname(file.name).toLowerCase() === '.png')
                iconname = "icon" + iconindex++ + ".png";
            else if (path.extname(file.name).toLowerCase() === '.jpg')
                iconname = "icon" + iconindex++ + ".jpg";
            else if (path.extname(file.name).toLowerCase() === '.jpeg')
                iconname = "icon" + iconindex++ + ".jpeg";
            else {
                fs.unlinkSync(file.path, (err) => {
                    if (err) {
                        console.log("error: \n" + err);
                        return res.send({ success: false });
                    }
                });

            }
            fs.renameSync(file.path, icondir + iconname, (err) => {
                if (err) {
                    console.log("error: \n" + err);
                    return res.send({ success: false });
                }
            });
            let m = map.Markers[index];
            var sql = "UPDATE marker SET icon = ? WHERE lat = ? AND lng = ?;";
            var inserts = [iconname, m.Position.lat, m.Position.lng];
            sql = mysql.format(sql, inserts);
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            sql = "UPDATE map SET iconindex = '" + iconindex++ + "' WHERE id = '1';";
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            map.editMarkerAddIcon(index, icondir, iconname);
            return res.send({ success: true, dir: icondir, name: iconname });
        });
        form.on('field', (name, value) => {
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
        //ADD AUDIO TO MARKER
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let mp3dir = path.join(__dirname, "../../public/marker/audio/");
            let mp3name = "";
            if (path.extname(file.name).toLowerCase() === '.mp3')
                mp3name = "audio" + mp3index++ + ".mp3";
            else {
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("error: \n" + err);
                });
                return res.send({ success: false });
            }
            fs.renameSync(file.path, mp3dir + mp3name, (err) => {
                if (err) {
                    console.log("error: \n" + err);
                    return res.send({ success: false });
                }
            });
            let m = map.Markers[index];
            var sql = "UPDATE marker SET audio = ? WHERE lat = ? AND lng = ?;";
            var inserts = [mp3name, m.Position.lat, m.Position.lng];
            sql = mysql.format(sql, inserts);
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            sql = "UPDATE map SET mp3index = '" + mp3index++ + "' WHERE id = '1';";
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            map.editMarkerAddMp3(index, mp3dir, mp3name);
            return res.send({ success: true, dir: mp3dir, name: mp3name });
        });
        form.on('field', (name, value) => {
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
    .post('/edit/markericon/add', (req, res) => {
        //ADD MARKERICON TO MARKER
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let markericondir = path.join(__dirname, "../../public/marker/markericon/");
            let markericonname = "";
            if (path.extname(file.name).toLowerCase() === '.png')
                markericonname = "markericon" + markericonindex++ + ".png";
            else if (path.extname(file.name).toLowerCase() === '.jpg')
                markericonname = "markericon" + markericonindex++ + ".jpg";
            else if (path.extname(file.name).toLowerCase() === '.jpeg')
                markericonname = "markericon" + markericonindex++ + ".jpeg";
            else {
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("error: \n" + err);
                });
                return res.send({ success: false });
            }
            fs.renameSync(file.path, markericondir + markericonname, (err) => {
                if (err) {
                    console.log("error: \n" + err);
                    return res.send({ success: false });
                }
            });
            let m = map.Markers[index];
            var sql = "UPDATE marker SET markericon = ? WHERE lat = ? AND lng = ?;";
            var inserts = [markericonname, m.Position.lat, m.Position.lng];
            sql = mysql.format(sql, inserts);
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            sql = "UPDATE map SET markericonindex = '" + markericonindex++ + "' WHERE id = '1';";
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            map.editMarkerAddMarkerIcon(index, markericondir, markericonname);
            return res.send({ success: true, dir: markericondir, name: markericonname });
        });
        form.on('field', (name, value) => {
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