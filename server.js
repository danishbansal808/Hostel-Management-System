const express = require('express');
const fs = require('fs');
const passport = require('passport');
const path = require('path');
const studentlogin = require('./routes/student/studentlogin');
const studentregister = require('./routes/student/studentregister');
const adminlogin = require('./routes/admin/adminlogin');
const home = require('./routes/home/home');
const complaints = require('./routes/student/complaints');
const addmessdata = require('./routes/admin/addmessdata');
const chalk = require('chalk');

var app = express();
const port=process.env.PORT || 3001
app.use('/resources',express.static(path.join(__dirname,'assets')))



app.get('/',home);
app.get('/home',home);
app.get('/student_login',studentlogin);
app.post('/student_login',studentlogin);
app.get('/admin_login',adminlogin);
app.post('/admin_login',adminlogin)
app.get('/student_register',studentregister)
app.post('/register',studentregister)
app.get('/studenthome',studentregister)
app.get('/profile',studentregister)
app.get('/adminprofile',adminlogin)
app.get('/student_logout',studentregister)
app.get('/admin_logout',adminlogin)
app.get('/complaints',complaints)
app.post('/complaints',complaints)
app.post('/searchdata',complaints)
app.get('/addmessdata',adminlogin)



app.use(function(req,res,next){
  res.status(404).send("Not Found");
  next();
})
app.use(function(err,req,res,next){
  res.send(err.message);
  next();
})


app.listen(port);
console.log(chalk.blue(port));
