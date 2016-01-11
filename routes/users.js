var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

function Users() {
  return knex('users');
}

function Pets() {
  return knex('pets');
}

router.get('/:id', function(req, res) {
  Users().select().where('id', req.params.id).first()
  .then(function(profile) {
    Pets().select().then(function(pets) {
      res.render('profile', {
        user_data: profile,
        pets: pets
      });
    });
  });
});

module.exports = router;
