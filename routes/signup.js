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
  res.render('signup', {error: req.query.error});
});

router.post('/',function(req, res, next){
  bcrypt.hash(req.body.password, 10, function(err, hash){
    if(err){
      return next(err);
    }
    Users().insert({
      User_Name: req.body.username,
      Email: req.body.email,
      Password: hash,
      Role: 'User',
      DOB: req.body.dob
    }, 'id').then(function(id){
      console.log(id);
      Users().where('id', id[0]).then(function(user){
        req.login(user, function(err){
         if(!err){
           res.redirect('/create.html');
         }else{
           res.redirect('/signup?error=' + err);
         }
      });
      });
      // res.redirect('/login');
    }).catch(function(err){
      res.render('signup', {error: err});
    });
  });

});



module.exports = router;
