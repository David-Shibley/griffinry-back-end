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
  .select('users.User_Name', 'users.DOB', 'users.About_Me', 'users.id', 'adoptions.Name', 'adoptions.Pet_Id', 'adoptions.Color', 'adoptions.id as adoptions_id')
  .innerJoin('adoptions', 'adoptions.User_Id', 'users.id').first()
  .then(function(adoptions) {
      console.log('adoptions', adoptions);
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

router.post('/:id', function(req, res){
  if (req.user || req.params.id === req.user.id) {
    console.log("pw ", req.body);
    Users().where('id', req.params.id).update({
      User_Name: req.body.username,
      DOB: req.body.DOB,
      About_Me: req.body.about,
      Password: bcrypt.hashSync(req.body.password, 10)
    }).then(function(){
      res.redirect('/' + req.params.id);
    });
  } else {
    res.end('You do not have permision to edit this user');
  }
});


router.get('/:id/delete', function(req, res) {
  if (req.params.id == req.user.id || req.user.Role == 'Administrator') {
    Adoptions().where('User_Id', req.params.id).del()
    .then(function() {
      Users().where('id', req.params.id).del()
      .then(function() {
        res.redirect('/login');
      });
    }).catch(function(err) {
      console.error(err);
    });
  } else {
    res.end('You do not have permision to delete this user');
  }
});

module.exports = router;
