var express = require('express');
var knex = require('../db/knex');
var router = express.Router();
var passport = require('passport');

// router.get('/google',
//   passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
router.get('/google',
  passport.authenticate('google', { scope: 'email' }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/', function(req, res) {
  Players().select().then(function(players){
    res.render('players', {
      title: 'Broncos Players',
      players: players,
      user: req.user
    });
  });
});

module.exports = router;
