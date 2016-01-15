var express = require('express');
var knex = require('../db/knex');
var router = express.Router();
var bcrypt = require('bcrypt');

function Users() {
  return knex('users');
}

function Resources() {
  return knex('user_resources');
}

function Adoptions() {
  return knex('adoptions');
}

router.get('/:id', function(req, res) {
  Users().where('users.id', req.params.id)
  .select('users.User_Name', 'users.DOB', 'users.Role', 'users.About_Me', 'users.id', 'adoptions.Name', 'adoptions.Pet_Id', 'adoptions.Color', 'adoptions.id as adoptions_id')
  .innerJoin('adoptions', 'adoptions.User_Id', 'users.id')
  .then(function(adoptions) {
    if(Array.isArray(req.user)){
      console.log('req.user is an array');
      req.user.id = req.user[0].id;
    }
    if (adoptions.length === 0) {
      Users().where('id', req.params.id).first()
      .then(function(user) {
        if (user) {
            res.render('profile', {
              user_data: [user],
              authenticated: req.user ? (req.user.id === Number(req.params.id) || req.user.Role === 'Administrator') : false
            });
        } else {
          res.render('profile', {
            error: 'User not found'
          });
        }
      });
    } else {
      if (req.user) {
        if (req.user.id === Number(req.params.id) || req.user.Role === 'Administrator') {
          res.render('profile', {
            user_data: adoptions,
            authenticated: true
          });
        } else {
          res.render('profile', {
            user_data: adoptions,
            authenticated: false
          });
        }
      } else {
        res.render('profile', {
          user_data: adoptions,
          authenticated: false
        });
      }
    }
  });
});

router.get('/:id/edit', function(req, res) {
  Users().where('id', req.params.id).first()
  .then(function(info) {
    console.log(info);
    if(Array.isArray(req.user)){
      req.user.id = req.user[0].id;
      req.user = req.user[0];
    }
    if (req.user && req.params.id == req.user.id) {
      res.render('edit', {
        user: info
      });
    } else {
      res.end('You do not have permision to edit this user');
    }
  })
});

router.post('/:id', function(req, res){
  if(Array.isArray(req.user)){
    req.user.id = req.user[0].id;
  }
  if (req.user || req.params.id === req.user.id) {
    console.log("pw ", req.body);
    Users().where('id', req.params.id).update({
      User_Name: req.body.username,
      DOB: req.body.DOB,
      About_Me: req.body.about
    }).then(function(){
      res.redirect('/users/' + req.params.id);
    });
  } else {
    res.end('You do not have permision to edit this user');
  }
});


router.get('/:id/delete', function(req, res) {
  if(Array.isArray(req.user)){
    req.user.id = req.user[0].id;
  }
  if (req.params.id == req.user.id || req.user.Role == 'Administrator') {
    Adoptions().where('User_Id', req.params.id).del()
    .then(function() {
      Resources().where('User_Id', req.params.id).del()
      .then(function() {
        Users().where('id', req.params.id).del()
        .then(function() {
          if(req.user.Role != 'Administrator'){
            req.logout();
            res.redirect('/');
          }else{
            res.redirect('/dashboard');
          }
        });
      });
    }).catch(function(err) {
      console.error(err);
    });
  } else {
    res.end('You do not have permision to delete this user');
  }
});

module.exports = router;
