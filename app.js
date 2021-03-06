var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var knex = require('./db/knex');
var bcrypt = require('bcrypt');
var ensurePets = require('./bin/ensurepets');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var signup = require('./routes/signup');
var resources = require('./routes/resources');
var adoptions = require('./routes/adoptions');
var pets = require('./routes/pets');
var dashboard = require('./routes/dashboard');
var userId = require('./routes/api');

function isAuthenticated(req, res, next){
  console.log(req.originalUrl);
  if(req.isAuthenticated()){
    next();
  }else{
    res.status(401);
    res.redirect('/');
  }
}

require('dotenv').load();

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // process.nextTick(function(){
      // console.log(profile.emails[0].value);
      // console.log(profile);
      console.log('got here');
      console.log('profile', profile);
      console.log('profile.emails', profile.emails);
      knex('users').select().where('Email', profile.emails[0].value).first().then(function(user){
        if(user){
          console.log('hi', user);
          return done(null, user);
        }else{
          console.log('profile again', profile);
          return done(null, profile);
        }
      }).catch(function(error){
        console.log(error);
        return done(null, profile);
      });
    // });
  }
));
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.HOST + "/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function(){
//       console.log(profile.emails[0].value);
//       console.log(profile);
//       return done(null, profile);
//     });
//   }
// ));

passport.use(new LocalStrategy(
  function(username, password, done){
    knex('users').select().where('User_Name', username).first().then(function(user){
        if(user){
          bcrypt.compare(password, user.Password, function(err, res){
            if(err){
              return done(err);
            }else if(res){
              return done(null, user);
            }else{
              return done('Invalid username or password');
            }
          });
        }else{
          console.log('User not found in db');
          return done('not registered');
        }
    });
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.locals.moment = require('moment');
app.use(function(req, res, next){
  app.locals.user = req.user;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', auth);
app.use('/signup', signup);
app.use('/', routes);
app.use('/users', users);
app.use('/resources', resources);
app.use('/adoptions', adoptions);
app.use('/pets', pets);
app.use('/dashboard', isAuthenticated, ensurePets, dashboard);
app.use('/userId', userId);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
