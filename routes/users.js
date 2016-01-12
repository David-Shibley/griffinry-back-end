var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

function Users() {
  return knex('users');
}

function Adoptions() {
  return knex('adoptions');
}

function Pets() {
  return knex('pets');
}

router.get('/:id', function(req, res) {
  Users().where('users.id', req.params.id)
  .innerJoin('adoptions', 'adoptions.User_Id', 'users.id')
  .select('users.User_Name', 'users.DOB', 'users.id', 'adoptions.Name', 'adoptions.Pet_Id', 'adoptions.Color', 'adoptions.id as adoptions_id')
  // .unionAll(function() {
  //   Adoptions().innerJoin('pets', 'pets.id','adoptions.Pet_Id')
  //   .select('pets.id as pets_id')
  // })
  .then(function(adoptions) {
    Pets().where('id', adoptions.Pet_Id).returning('Type').first()
    .then(function(pet) {
      res.render('profile', {
        user_data: adoptions,
        user_pet: pet
      });
    });
  });
});

module.exports = router;
