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
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'p_f18_1',
    password: 'ik6bcl',
    database: 'p_f18_1_db'
});
try {
    pool.query("SELECT * FROM marker;", function (err, result) {
        if (err) throw err;
        else if (result != undefined) {
            console.log(result);
            for (i = 0; i < result.length; i++) {
                map.initMarker(result[i].lat, result[i].lng, result[i].title, result[i].subtitle, result[i].description, result[i].image, result[i].icon, result[i].audio, result[i].markericon);
            }
        }
    });
    pool.query("SELECT * FROM map;", function (err, result) {
        if (err) throw err;
        else if (result == undefined) throw Error("MySQL map table data does not exist");
        else {
            map.editPosition({ lat: result[0].lat, lng: result[0].lng });
            map.editZoom(result[0].zoom);
            imgindex = result[0].imgindex;
            mp3index = result[0].mp3index;
            iconindex = result[0].iconindex;
            markericonindex = result[0].markericonindex;
        }
    });
}
catch (err) {
    console.log("Error: MySQL could not SELECT table data for initialization | data may not have initalized correctly \n" + err);
}





app
    .get('/state', (req, res) => {
        res.send({ success: true, map: map });
    })
    .post('/center', (req, res) => {
        try {
            var sql = "UPDATE map SET lat = ?, lng = ?, zoom = ? WHERE id = '1';";
            var inserts = [req.body.position.lat, req.body.position.lng, req.body.zoom];
            sql = mysql.format(sql, inserts);
            pool.query(sql, function (err, result) {
                if (err) throw err;
                else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                else {
                    map.editPosition(req.body.position);
                    map.editZoom(req.body.zoom);
                    console.log("map data updated...");
                    res.send({ success: true });
                }
            });
        }
        catch (err) {
            console.log("Error: MySQL could not UPDATE map position data | data may not remain persistent \n" + err);
            return res.send({ success: false });
        }
    })
    .post('/add', (req, res) => {
        try {
            let m = req.body.marker;
            var sql = "INSERT INTO marker (lat, lng, title, subtitle, description, image, icon, audio, markericon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
            var inserts = [m.Position.lat, m.Position.lng, m.Title, m.Subtitle, m.Description, m.Image, m.Icon, m.Audio, m.MarkerIcon];
            sql = mysql.format(sql, inserts);
            pool.query(sql, function (err, result) {
                if (err) throw err;
                else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
            });
            map.addMarker(req.body.marker);
            console.log("marker data added...");
            res.send({ success: true });
        }
        catch (err) {
            console.log("Error: MySQL could not INSERT marker data | data may not remain persistent \n" + err);
            return res.send({ success: false });
        }
    })
    .post('/delete', (req, res) => {
        try {
            let m = map.Markers[req.body.index];
            var sql = "DELETE FROM marker WHERE lat = ? AND lng = ?;";
            var inserts = [m.Position.lat, m.Position.lng];
            sql = mysql.format(sql, inserts);
            pool.query(sql, function (err, result) {
                if (err) throw err;
                else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
            });
            map.deleteMarker(req.body.index);
            console.log("marker data deleted...");
            res.send({ success: true });
        }
        catch (err) {
            console.log("Error: MySQL could not DELETE marker data | data may not remain persistent \n" + err);
            return res.send({ success: false });
        }
    })
    .post('/drag', (req, res) => {
        try {
            let m = map.Markers[req.body.index];
            var sql = "UPDATE marker SET lat = ?, lng = ? WHERE lat = ? AND lng = ?;";
            var inserts = [req.body.position.lat, req.body.position.lng, m.Position.lat, m.Position.lng];
            sql = mysql.format(sql, inserts);
            pool.query(sql, function (err, result) {
                if (err) throw err;
                else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
            });
            map.dragMarker(req.body.index, req.body.position);
            console.log("marker data dragged...");
            res.send({ success: true });
        }
        catch (err) {
            console.log("Error: MySQL could not UPDATE marker poisition data | data may not remain persistent \n" + err);
            return res.send({ success: false });
        }

    })
    .post('/edit', (req, res) => {
        try {
            let m = req.body.marker;
            var sql = "UPDATE marker SET title = ?, subtitle = ?, description = ? WHERE lat = ? AND lng = ?;";
            var inserts = [m.Title, m.Subtitle, m.Description, m.Position.lat, m.Position.lng];
            sql = mysql.format(sql, inserts);
            pool.query(sql, function (err, result) {
                if (err) throw err;
                else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
            });
            map.editMarker(req.body.index, req.body.marker);
            console.log("marker data edited...");
            res.send({ success: true });
        }
        catch (err) {
            console.log("Error: MySQL could not UPDATE marker text data | data may not remain persistent \n" + err);
            return res.send({ success: false });
        }
    })
    .post('/edit/image/add', (req, res) => {
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let imgname = "";
            let imgdir = path.join(__dirname, "../../public/marker/images/");
            try {
                if (path.extname(file.name).toLowerCase() === '.png')
                    imgname = "image" + imgindex++ + ".png";
                else if (path.extname(file.name).toLowerCase() === '.jpg')
                    imgname = "image" + imgindex++ + ".jpg";
                else if (path.extname(file.name).toLowerCase() === '.jpeg')
                    imgname = "image" + imgindex++ + ".jpeg";
                else
                    throw Error("Uploaded file has an invalid extension");
                fs.renameSync(file.path, imgdir + imgname, (err) => {
                    if (err) throw err;
                });
            }
            catch (err) {
                console.log("Error: Server could not write image file to the filesystem | data may not remain persistent \n" + err);
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("Error: Could not unlink uploaded file path");
                });
                return res.send({ success: false });
            }
            try {
                let m = map.Markers[index];
                var sql = "UPDATE marker SET image = ? WHERE lat = ? AND lng = ?;";
                var inserts = [imgname, m.Position.lat, m.Position.lng];
                sql = mysql.format(sql, inserts);
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                });
                sql = "UPDATE map SET imgindex = '" + imgindex++ + "' WHERE id = '1';";
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                });
                map.editMarkerAddImg(index, imgdir, imgname);
                console.log("marker image data updated...");
                res.send({ success: true, dir: imgdir, name: imgname });
            }
            catch (err) {
                console.log("Error: MySQL could not UPDATE marker image data | data may not remain persistent \n" + err);
                return res.send({ success: false });
            }
        });
        form.on('field', (name, value) => {
            if (name == 'index')
                index = Number(value);
        });
        form.on('error', (err) => {
            console.log("Error: Form submission middleware error + \n" + err);
            return res.send({ success: false });
        });
        form.parse(req);

    })
    .post('/edit/icon/add', (req, res) => {
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let icondir = path.join(__dirname, "../../public/marker/icons/");
            let iconname = "";
            try {
                if (path.extname(file.name).toLowerCase() === '.png')
                    iconname = "icon" + iconindex++ + ".png";
                else if (path.extname(file.name).toLowerCase() === '.jpg')
                    iconname = "icon" + iconindex++ + ".jpg";
                else if (path.extname(file.name).toLowerCase() === '.jpeg')
                    iconname = "icon" + iconindex++ + ".jpeg";
                else
                    throw Error("Uploaded file has an invalid extension");
                fs.renameSync(file.path, icondir + iconname, (err) => {
                    if (err) throw err;
                });
            }
            catch (err) {
                console.log("Error: Server could not write icon file to the filesystem | data may not remain persistent \n" + err);
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("Error: Could not unlink uploaded file path");
                });
                return res.send({ success: false });
            }
            try {
                let m = map.Markers[index];
                var sql = "UPDATE marker SET icon = ? WHERE lat = ? AND lng = ?;";
                var inserts = [iconname, m.Position.lat, m.Position.lng];
                sql = mysql.format(sql, inserts);
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                });
                sql = "UPDATE map SET iconindex = '" + iconindex++ + "' WHERE id = '1';";
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                });
                map.editMarkerAddIcon(index, icondir, iconname);
                console.log("marker icon data updated...");
                res.send({ success: true, dir: icondir, name: iconname });
            }
            catch (err) {
                console.log("Error: MySQL could not UPDATE marker icon data | data may not remain persistent \n" + err);
                return res.send({ success: false });
            }
        });
        form.on('field', (name, value) => {
            if (name == 'index')
                index = Number(value);
        });
        form.on('error', (err) => {
            console.log("Error: Form submission middleware error + \n" + err);
            return res.send({ success: false });
        });
        form.parse(req);

    })
    .post('/edit/mp3/add', (req, res) => {
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let mp3dir = path.join(__dirname, "../../public/marker/audio/");
            let mp3name = "";
            try {
                if (path.extname(file.name).toLowerCase() === '.mp3')
                    mp3name = "audio" + mp3index++ + ".mp3";
                else
                    throw Error("Uploaded file has an invalid extension");
                fs.renameSync(file.path, mp3dir + mp3name, (err) => {
                    if (err) throw err;
                });
            }
            catch (err) {
                console.log("Error: Server could not write audio file to the filesystem | data may not remain persistent \n" + err);
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("Error: Could not unlink uploaded file path");
                });
                return res.send({ success: false });
            }
            try {
                let m = map.Markers[index];
                var sql = "UPDATE marker SET audio = ? WHERE lat = ? AND lng = ?;";
                var inserts = [mp3name, m.Position.lat, m.Position.lng];
                sql = mysql.format(sql, inserts);
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                });
                sql = "UPDATE map SET mp3index = '" + mp3index++ + "' WHERE id = '1';";
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                });
                map.editMarkerAddMp3(index, mp3dir, mp3name);
                console.log("marker audio data updated...");
                res.send({ success: true, dir: mp3dir, name: mp3name });
            }
            catch (err) {
                console.log("Error: MySQL could not UPDATE marker audio data | data may not remain persistent \n" + err);
                return res.send({ success: false });
            }
        });
        form.on('field', (name, value) => {
            if (name == 'index')
                index = Number(value);
        });
        form.on('error', (err) => {
            console.log("Error: Form submission middleware error + \n" + err);
            return res.send({ success: false });
        });
        form.parse(req);

    })
    .post('/edit/markericon/add', (req, res) => {
        let form = new formidable.IncomingForm();
        let index;

        form.on('file', (name, file) => {
            let markericondir = path.join(__dirname, "../../public/marker/markericon/");
            let markericonname = "";
            try {
                if (path.extname(file.name).toLowerCase() === '.png')
                    markericonname = "markericon" + markericonindex++ + ".png";
                else if (path.extname(file.name).toLowerCase() === '.jpg')
                    markericonname = "markericon" + markericonindex++ + ".jpg";
                else if (path.extname(file.name).toLowerCase() === '.jpeg')
                    markericonname = "markericon" + markericonindex++ + ".jpeg";
                else
                    throw Error("Uploaded file has an invalid extension");
                fs.renameSync(file.path, markericondir + markericonname, (err) => {
                    if (err) throw err;
                });
            }
            catch (err) {
                console.log("Error: Server could not write marker-icon file to the filesystem | data may not remain persistent \n" + err);
                fs.unlinkSync(file.path, (err) => {
                    if (err) console.log("Error: Could not unlink uploaded file path");
                });
                return res.send({ success: false });
            }
            try {
                let m = map.Markers[index];
                var sql = "UPDATE marker SET markericon = ? WHERE lat = ? AND lng = ?;";
                var inserts = [markericonname, m.Position.lat, m.Position.lng];
                sql = mysql.format(sql, inserts);
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                });
                sql = "UPDATE map SET markericonindex = '" + markericonindex++ + "' WHERE id = '1';";
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    else if (result.affectedRows == false) throw Error("MySQL connected, 0 rows affected");
                });
                map.editMarkerAddMarkerIcon(index, markericondir, markericonname);
                console.log("marker marker-icon data updated...");
                res.send({ success: true, dir: markericondir, name: markericonname });
            }
            catch (err) {
                console.log("Error: MySQL could not UPDATE marker marker-icon data | data may not remain persistent \n" + err);
                return res.send({ success: false });
            }
        });
        form.on('field', (name, value) => {
            if (name == 'index')
                index = Number(value);
        });
        form.on('error', (err) => {
            console.log("Error: Form submission middleware error + \n" + err);
            return res.send({ success: false });
        });
        form.parse(req);

    });

module.exports = app;