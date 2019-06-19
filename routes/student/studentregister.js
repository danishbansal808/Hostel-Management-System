/*----------------------------------Required Packages-----------------------------------------*/
//Express Framework
const express = require('express');
//To parse the body to hide data during post request
const bodyparser = require('body-parser');
//To hash a password entered by user for saftey
const bcrypt = require('bcrypt');
//To validate the entered by user before submitting it into Database
const validator = require('express-validator');
//Authuntication Packages
//Express session create a session and maintains it
const session = require('express-session');
//Passport is used to Authunticate session with cookie
const passport = require('passport');
//Stores session in our database
var store = require('express-mysql-session')(session);
//Strategy used to authenticate a session
const LocalStrategy = require('passport-local');

//Rounds for hashing a password i.e. how much time it molds the password
const saltRounds = 10;
/*-------------------------------------Middlewares-----------------------------------------*/

//making an variable 'app' which contains all the function and objects of express framework
var app = express();
/*Setting our engine to view, compile and render the HTML in files having .ejs extension..
AND mainly used to Send data from backend to HTML before showig to user*/
app.set('view engine', 'ejs');
/*Middleware to tell node that the assets folder is public and can be accessed by anyone
 as by defalut in node js all files are hidden*/
app.use('/resources', express.static('assets'))
/*Middleware to parse our POST URL*/
app.use(bodyparser.json())
var urlencodedParser = bodyparser.urlencoded({
  extended: true
});
/*Middleware for validating user inputs*/
app.use(validator());
/*Database connection values for session storages*/
var options = {
  host: '35.232.171.90',
  user: 'danish1',
  password: '00000000',
  database: 'registration',
  port: 3306
};
/*Handling for all request to input session in our database*/
var sessionStore = new store(options);
/*Creating a session*/
app.use(session({
secret: '46386432726381362@*#&@^#*!%216783',
resave: false,
store:sessionStore,
saveUninitialized: false,
//cookie: { secure: false }
}))
/*Initializing Passport to Authunticate cookies for our session*/
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.isAuthenticatedstudent = req.isAuthenticated();
  res.locals.isAuthenticatedadmin = req.isAuthenticated().false;
  next();
/*Stratagy for authinacting user*/
passport.use('student',new LocalStrategy(
  {usernameField:"email", passwordField:"password"},
  function(email, password, done) {
      console.log(email);
      console.log(password);
      var connection = require('./../connection_database/connection')
      sql = `SELECT Password,ID FROM users WHERE Email = ?`;
      data=[email]
      connection.query(sql,data,function(err, row, field){
        console.log("Connected to login Database");
        if (err) {done(err)};
        console.log(row.length);
        if(row.length===0){
          console.log(row[0]);
          return done(null,false);
          res.redirect('/student_login')
        }
        else{
          var hash=row[0].Password.toString();
          bcrypt.compare(password,hash,function(err,res){
            if(res=== true){
                return done(null,{user_id:row[0].ID});
            }
            else{
              return done(null,false);

            }
          })
        }
      })
    }))
})

/*--------------------Handling GET and POST requests---------------------------------- */
app.get('/student_register', function(req, res) {
  res.render('studentregister', {
    title: "Welcome to Registration Portal",
    errors:""
  });
})


app.get('/studenthome',function(req,res){
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('studenthome')
})


app.get('/profile', authenticationMiddleware(),function(req, res) {
    res.render('profile');
})





app.post('/register', urlencodedParser, function(req, res) {
  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
  req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i')
  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
  req.checkBody('password', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    console.log(`${JSON.stringify(errors)}`);
    res.render('studentregister', {
      title: "Welcomw to Registration Portal",
      errors:errors
    });
  }
  else{
  var email = req.body.email,
    password = req.body.passwordMatch,
    username = req.body.username;
  sql = `INSERT INTO users(Email,Password,username) VALUES (?,?,?)`;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    var connection = require('./../connection_database/connection'),
      data = [email, hash, username];

    connection.query(sql, data, function(err, row, field) {
      if (!!err) {
        console.log(err);
      }
        console.log("Data inserted successfully");
        connection.query('SELECT LAST_INSERT_ID() as user_id',function(err,row,field){
          if (err) {
            throw err;
          }
          const user_id=row[0];
          console.log(user_id);
          req.login(user_id,function(err){
            res.redirect('/studenthome')
          })
        })
      console.log(req.session);
    })
  })
 }
});
app.get('/student_logout',function(req,res){
  req.logout();
  req.session.destroy(function(err){
    res.redirect('/studenthome');
  })
})
/*----------------------serializing and deserializing user---------------------------*/
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
      done(null, user_id);
});
function authenticationMiddleware () {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/student_login')
	}
}

/*----------------------------------Exporting module to the outside world------------------*/
module.exports = app;
