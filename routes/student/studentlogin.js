const express = require('express');
const studentregister = require('./studentregister');
const path = require('path');
const connection = require('./../connection_database/connection');
const bodyparser = require('body-parser');
const passport = require('passport');
var app = express();
app.set('view engine', 'ejs');
app.use('/resources', express.static('assets'))
var urlencodedParser = bodyparser.urlencoded({
  extended: true
});
app.get('/student_login',studentregister, function(req, res) {
  res.render('studentlogin');
})
app.post('/student_login',studentregister,urlencodedParser,passport.authenticate('student',{
  successRedirect:'/profile',
  faliureRedirect:'/student_login'
}));
module.exports = app;
