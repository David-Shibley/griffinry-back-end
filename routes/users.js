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
  if (req.user && req.params.id == req.user.id) {
    Users().where('id', req.params.id).first()
    .then(function(user) {
      res.render('edit', {
        user: user
      });
    });
  } else {
    res.end('You do not have permision to edit this user');
  }
});

router.post('/:id/edit', function(req, res){
  if (req.user && req.params.id == req.user.id) {
    Users().where('id', req.params.id).first()
    .then(function(user){
      Users().update({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      }).then(function(){
        res.redirect('/users/' + req.params.id);
      });
    });
  } else {
    res.end('You do not have permision to edit this user');
  }
});


router.get('/:id/delete', function(req, res) {
  if (req.user && req.params.id == req.user.id) {
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
