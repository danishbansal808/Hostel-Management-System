const express = require('express');
const bodyparser = require('./../bodyparser/urlencodedparser');
//const multer = require('multer');
const path = require('path');
const connection = require('./../connection_database/connection');
const adminlogin = require('./adminlogin');
const passport = require('passport');

var app= express()
app.set('view engine','ejs')
app.use('/resources',express.static('assets'))

app.get('/addmessdata',function(req,res){
    res.render('addmessdata');
})

module.exports=app;
