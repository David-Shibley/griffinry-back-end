var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var moment = require('moment');

function Users(){
  return knex('users');
}

function emailValidator(req) {
  var email = req.email;

  var invalid = [];

  if (email.indexOf("@") < 1 || email.lastIndexOf(".") < email.indexOf("@") + 2 || email.lastIndexOf(".") + 2 >= email.length) {
    invalid.push("*Email");
  }

  if (invalid.length != 0) {
    return false;
  }

  return true;
}

function passwordValidator(req) {
  var password = req.password;

  var invalid = [];

  if (password.length < 8) {
    invalid.push("*Password");
  }

  if (invalid.length != 0) {
    return false;
  }

  return true;
}

function dateValidator(req) {
  var currentDate = moment(new Date())._d;
  var formattedDate = moment(req.dob)._d;
  if (currentDate > formattedDate) {
    return true;
  }

  return false;

}

router.get('/', function(req, res){
  if(req.isAuthenticated()){
  res.redirect('/dashboard');
  }
  res.render('signup', {error: req.query.error});
});

router.post('/',function(req, res, next){
  var validEmail = emailValidator(req.body);
  var validPassword = passwordValidator(req.body);
  var validDOB = dateValidator(req.body);
  if (!validEmail) {
    return res.render('signup', {
      error: 'Email must be in proper format "example@email.com"'
    });
  }
  // if (!validPassword) {
  //   res.render('signup', {
  //     error: 'Password must be at least 8 characters'
  //   });
  // }
  // if (!validPassword) {
  //   return res.render('signup', {
  //     error: 'Password must be at least 8 characters'
  //   });
  // }
  if (!validDOB) {
    return res.render('signup', {
      error: 'Birthdate cannot be in the future, sorry time travelers and aliens.'
    });
  }
  bcrypt.hash(req.body.password, 10, function(err, hash){
    if(err){
      console.log(err);
      return next(err);
    }
    Users().insert({
      User_Name: req.body.username,
      Email: req.body.email,
      About_Me: req.body.about,
      Password: hash,
      Role: 'User',
      DOB: req.body.dob
    }, 'id').then(function(id){
      console.log('id',id);
      Users().where('id', id[0]).then(function(user){
        req.login(user, function(err){
         if(!err){
           console.log(user);
           res.redirect('/create.html');
         }else{
           console.log(err);
           res.redirect('/signup?error=' + err);
         }
      });
      });
      // res.redirect('/login');
    }).catch(function(err){
      var errorType = err.constraint;
      if (errorType == 'users_user_name_unique') {
        return res.render('signup', {
          error: 'That user name is already taken!'
        });
      } else if (errorType == 'users_email_unique') {
        return res.render('signup', {
          error: 'That email is already taken!'
        });
      } else {
        return res.render('signup', {error: err});
      }
    });
  });

});



module.exports = router;
