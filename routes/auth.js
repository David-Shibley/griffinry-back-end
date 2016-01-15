var express = require('express');
var app = express();
var knex = require('../db/knex');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');


router.get('/google',
  passport.authenticate('google', { scope: 'email' }));
  router.get('/google/callback', function(req, res, next){
    passport.authenticate('google', function(err, user, info){
      console.log("user",  user);
      if(err){
        return next(err);
      }else if(user){
        if(user.User_Name){
          req.login(user, function(err){
            if(!err){
              res.redirect('/dashboard');
            }else{
              res.redirect('signup?error=' + err);
            }
          });
        }else{
          console.log("google User", user);
          console.log('user.emails',  user.emails);
          console.log('req.user', req.user);
          res.render('username', {email:  user.emails ? user.emails[0].value : ""});
        }
      }else{
        next('unable to login');
      }

    })(req, res, next);
  });
// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
// });

router.post('/login',
  function(req, res, next){
     passport.authenticate('local', function(err, user, info){
       if(err){
         res.redirect('/signup?error=' + err);
       }else if (user){
         req.login(user, function(err){
          if(!err){
            res.redirect('/dashboard');
          }else{
            res.redirect('/signup?error=' + err);
          }
        });
       }else{
         res.redirect('/signup?error=No Password Provided');
       }
     })(req, res, next);
});

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

// router.get('/', function(req, res) {
//   Players().select().then(function(players){
//     res.render('players', {
//       title: 'Broncos Players',
//       players: players,
//       user: req.user
//     });
//   });
// });

module.exports = router;
