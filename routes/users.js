var express = require('express');
var knex = require('../db/knex');
var router = express.Router();
var bcrypt = require('bcrypt');

function Users() {
  return knex('users');
}

function Adoptions() {
  return knex('adoptions');
}

router.get('/:id', function(req, res) {
  Users().where('users.id', req.params.id)
  .select('users.User_Name', 'users.DOB', 'users.id', 'adoptions.Name', 'adoptions.Pet_Id', 'adoptions.Color', 'adoptions.id as adoptions_id')
  .innerJoin('adoptions', 'adoptions.User_Id', 'users.id')
  .then(function(adoptions) {
      console.log(adoptions);
      res.render('profile', {
        user_data: adoptions
      });
  });
});

router.get('/:id/edit', function(req, res) {
  console.log('user ', req.user);
  if (req.user && req.params.id == req.user.id) {
    res.render('edit', {
      user: req.user
    });
  } else {
    res.end('You do not have permision to edit this user');
  }
});

router.put('/:id', function(req, res){
  if (!req.user || req.params.id !== req.user.id) {
      res.end('You do not have permision to edit this user');
  } else {
    console.log("pw ", req.body.password);
    Users().where('id', req.params.id).update({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    }).then(function(){
      res.redirect('/' + req.params.id);
    });
  }
});


router.get('/:id/delete', function(req, res) {
  // append to 52: || req.user.Role == 'Administrator'
  if (req.user && req.params.id === req.user.id) {
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
