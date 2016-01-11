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
  Users().select().where('id', req.params.id).first()
  .then(function(profile) {
    Adoptions().select().then(function(adoptions) {
      res.render('profile', {
        user_data: profile,
        adoptions: adoptions
      });
    });
  });
});

module.exports = router;
