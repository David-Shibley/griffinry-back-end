var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

function Users() {
  return knex('users');
}

function Adoptions() {
  return knex('adoptions');
}

router.get('/:id', function(req, res) {
  Users().where('users.id', req.params.id)
  .innerJoin('adoptions', 'adoptions.User_Id', 'users.id')
  .select('users.User_Name', 'users.DOB', 'users.id', 'adoptions.Name', 'adoptions.Color', 'adoptions.id as adoptions_id')
  // .unionAll(function() {
  //   Adoptions().innerJoin('pets', 'pets.id','adoptions.Pet_Id')
  //   .select('pets.id as pets_id')
  // })
  .then(function(adoptions) {
    console.log(adoptions);
    // Adoptions().where('User_Id', profile.).then(function(adoptions) {
      res.render('profile', {
        user_data: adoptions,
        // adoptions: adoptions
      });
    // });
  });
});

module.exports = router;
