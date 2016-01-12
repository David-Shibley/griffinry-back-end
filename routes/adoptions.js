var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');

function Pets(){
  return knex('pets');
}

function Adoptions(){
  return knex('adoptions')
};

router.post('/add', function(req, res){
  Adoptions().insert({
    User_Id: req.body.userId,
    Pet_Id: req.body.petId,
    Color: req.body.color,
    Name: req.body.name,
    Experience: 0,
    Max_Health: 10,
    Max_Energy: 5,
    Current_Health: 10,
    Current_Energy: 5,
    Last_Updated: new Date()
  }, 'id').then(function(id){
    res.send("Success. ID=" + id);
  })
});

module.exports = router;
