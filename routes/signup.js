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

router.post('/',function(req, res){
  bcrypt.hash(req.body.password, 10, function(err, hash){
    Users().insert({
      User_Name: req.body.username,
      Email: req.body.email,
      Password: hash,
      Role: 'User',
      DOB: req.body.dob
    }, 'id').then(function(id){
      res.redirect('/create.html');
    });
  });

});



module.exports = router;
