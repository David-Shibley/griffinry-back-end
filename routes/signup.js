var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');
var bcrypt = require('bcrypt');

function Users(){
  return knex('users');
}


router.post('/',function(req, res){
  bcrypt.hash(req.body.Password, 10, function(err, hash){
    Users().insert({
      User_Name: req.body.User_Name,
      Email: req.body.Email,
      Password: hash,
      Role: 'User',
      DOB: req.body.DOB
    }, 'id').then(function(id){
      res.redirect('/create_pet');
    });
  });

});



module.exports = router;
