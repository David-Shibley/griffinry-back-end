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
  .select('users.User_Name', 'users.DOB', 'users.id', 'adoptions.Name', 'adoptions.Pet_Id', 'adoptions.Color', 'adoptions.id as adoptions_id')
  .innerJoin('adoptions', 'adoptions.User_Id', 'users.id')
  // .unionAll(function() {
  //   Adoptions().innerJoin('pets', 'pets.id','adoptions.Pet_Id')
  //   .select('pets.id as pets_id')
  // })
  .then(function(adoptions) {
    // Pets().where('id', adoptions.Pet_Id).returning('Type').first()
    // .then(function(pet) {
      console.log(adoptions);
      res.render('profile', {
        user_data: adoptions
        // user_pet: pet
      });
    // });
  });
});

router.get('/:id/edit', function(req, res) {
  Users().where('id', req.params.id)
  .then(function(user) {
    res.render('edit', {
      user: user
    });
  });
});

router.post('/:id/edit', function(req, res) {
  Users().where('id', req.params.id)
  .then(function(user) {
    res.render('edit', {
      user: user
    });
  });
});

router.get('/:id/delete', function(req, res) {
  if (req.user && req.params.id == req.user.id) {
    Users().where('id', req.params.id).del().then(function() {
      res.redirect('/login');
    }).catch(function(err) {
      console.error(err);
    });
  } else {
    res.end('You do not have permision to delete this user');
  }
});

module.exports = router;
