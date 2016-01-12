var express = require('express');
var knex = require('../db/knex');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');


router.get('/google',
  passport.authenticate('google', { scope: 'email' }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/signup.html'}),
  function(req, res){
    res.redirect('/dashboard');
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
