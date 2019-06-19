const express = require('express');
const bodyparser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcrypt');
const session = require('express-session');
const chalk = require('chalk');
var store = require('express-mysql-session')(session);
var app = express();
app.set('view engine', 'ejs');
app.use('/resources', express.static('assets'))
app.use(bodyparser.json())
var urlencodedParser = bodyparser.urlencoded({
      extended: true})
var options = {
  host: '35.232.171.90',
  user: 'danish1',
  password: '00000000',
  database: 'registration',
  port: 3306
};
var sessionStore = new store(options);
    app.use(session({
    secret: '46386432726381362@*#&@^#*!%216783',
    resave: false,
    saveUninitialized: false,
    store:sessionStore,
    //cookie: { secure: false }
    }))
    /*Initializing Passport to Authunticate cookies for our session*/
    app.use(passport.initialize());
    app.use(passport.session());
       const LocalStrategy1 = require('passport-local');
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(function(req, res, next) {
          res.locals.isAuthenticatedadmin = req.isAuthenticated();
          res.locals.isAuthenticatedstudent = req.isAuthenticated().false;
          next();
          passport.use('admin',new LocalStrategy1({
              usernameField: "adminuser",
              passwordField: "password"
            },
            function(adminuser, password, done) {
              console.log(chalk.blue(adminuser));
              console.log(chalk.yellow(password));
              var connection = require('./../connection_database/connection')
              sql = `SELECT Password,ID FROM adminusers WHERE Username = ?`;
              data = [adminuser]
              connection.query(sql, data, function(err, row, field) {
                console.log("Connected to admin login Database");
                if (err) {
                  done(err)
                };
                console.log(chalk.blue(row.length));
                if (row.length === 0) {
                  console.log(chalk.yellow(row[0]));
                  return done(null, false);
                  res.redirect('/admin_login')
                } else {
                  var hash = row[0].Password.toString();
                  bcrypt.compare(password, hash, function(err, res) {
                    if (res === true) {
                      return done(null, {
                        user_id: row[0].ID
                      });
                    } else {
                      return done(null, false);

                    }
                  })
                }
              })
            }))
        })

app.get('/admin_login', function(req, res) {
  res.render('adminlogin');
})
app.get('/addmessdata',authenticationMiddleware(),function(req,res){
  res.render('addmessdata');
})
app.post('/admin_login',urlencodedParser,passport.authenticate('admin',{
  successRedirect:'/adminprofile',
  faliureRedirect:'/admin_login'
}));

app.get('/adminprofile', authenticationMiddleware(),function(req, res) {
  res.render('adminprofile');
})
app.get('/admin_logout',function(req,res){
  req.logout();
  req.session.destroy(function(err){
    res.redirect('/admin_login');
  })
})
function authenticationMiddleware () {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
	    if (req.isAuthenticated()) return next();
	    res.redirect('/admin_login')
	}
}
module.exports = app;
