var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');
var bcrypt = require('bcrypt');

function Users(){
  return knex('users');
}

// router.get('/', function(req, res){
//   res.sendFile('singup.html');
// });

router.get('/', function(req, res){
  if(req.isAuthenticated()){
  res.redirect('/dashboard');
  }
  res.render('signup', {error: req.query.error});
});

router.post('/',function(req, res, next){
  bcrypt.hash(req.body.password, 10, function(err, hash){
    if(err){
      console.log(err);
      return next(err);
    }
    Users().insert({
      User_Name: req.body.username,
      Email: req.body.email,
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
        res.render('signup', {
          error: 'That user name is already taken!'
        });
      } else if (errorType == 'users_email_unique') {
        res.render('signup', {
          error: 'That email is already taken!'
        });
      } else {
        res.render('signup', {error: err});
      }
    });
  });

});



module.exports = router;
