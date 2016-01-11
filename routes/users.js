var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

function Users() {
  return knex('Users');
}

router.get('/:id', function(req, res) {
  Users().select().where('id', req.params.id).first()
  .then(function(profile) {
    res.render('profile', {
      user_data: profile
    });
  });
});

module.exports = router;
