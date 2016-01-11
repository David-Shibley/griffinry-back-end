var express = require('express');
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

router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res){
    res.redirect('/dashboard');
});

module.exports = router;
