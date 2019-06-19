const express = require('express');
const path = require('path');
const parser = require('../bodyparser/urlencodedparser');
var app = express();
app.set('view engine', 'ejs');
app.use('/resources',express.static('assets'))
app.get('/', function(req, res) {
  res.render('choosehostel');
})
app.post('/',parser,function(req,res){
  var hostel=req.body.hostel;
  res.render('studenthome',{hostel:hostel})
})
module.exports = app;
