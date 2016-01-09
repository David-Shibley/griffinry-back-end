var express = require('express');
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

module.exports = router;
