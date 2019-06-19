const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const id = require('crypto-random-string');
const date = require('date-and-time');
const connection = require('../connection_database/connection');
const studentregister = require('./studentregister');
const passport = require('passport');
const session = require('express-session');
var app = express();

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});
let now = new Date();
date.format(now, 'YYYY/MM/DD HH:mm:ss');
app.set('view engine', 'ejs');
app.use('/resources', express.static('assets'));


app.get('/complaints', studentregister,function(req, res) {
  res.render('complaints', {
    qs: req.query
  });
});
app.post('/complaints',studentregister,urlencodedParser, function(req, res) {
  var name = req.body.uname,
    email = req.body.email,
    phone = req.body.pnumber,
    block = req.body.block,
    floor = req.body.floor,
    room = req.body.room,
    complaint = req.body.complainttype,
    description = req.body.Description,
    date = now;
    console.log(date)
  uid = 'UAN34VVG';
  console.log(uid)
  var stmnt = `INSERT INTO complaints(Name,
Email, Contact, Block, Floor, Room, Complaints, Description, Date, ID) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  var alldata = [name, email, phone, block, floor, room, complaint, description, date, uid];
  console.log("connected");
  connection.query(stmnt,
    alldata,
    function(err, row, fields) {
      if (!!err) {
        console.log(err);
      } else {
        console.log("Data inserted successfully");
        res.render('complaints-success', {
          data: req.body,
          uid
        });
      }
    })
});
app.post('/searchdata', studentregister,urlencodedParser, function(req, res) {
  var id = req.body.uid;
  var sql = 'SELECT * FROM `complaints` WHERE `ID` = ?';
  connection.query(sql, id, function(err, row, fields) {
    if (err) throw err;
    console.log('connect');
    res.render('yourcomplaint', {
      data: row
    });
  });
});

function authenticationMiddleware () {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/student_login')
	}
}
module.exports = app;
