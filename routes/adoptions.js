var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');
var db_User_Resources = require('../bin/db_User_Resources');

function Pets(){
  return knex('pets');
}

function Adoptions(){
  return knex('adoptions')
};

function getPetMaxHealth(adoptionId){
  return Adoptions().where('id', adoptionId).select('Max_Health').first()
};

function getPetCurrentHealth(adoptionId){
  return Adoptions().where('id', adoptionId).select('Current_Health').first()
};

function increasePetHealth(adoptionId, amount){
  return Adoptions().where('id', adoptionId).update('Current_Health', amount)
}

router.post('/add', function(req, res){
  Adoptions().insert({
    User_Id: req.body.userId,
    Pet_Id: req.body.petId,
    Color: req.body.color,
    Name: req.body.name,
    Experience: 0,
    Max_Health: 10,
    Max_Energy: 5,
    Current_Health: 10,
    Current_Energy: 5,
    Last_Updated: new Date()
  }, 'id').then(function(id){
    res.redirect('/dashboard')
    // res.send("Success. ID=" + id);
  })
});

router.get('/list/:id', function(req, res){
  Adoptions().select().where('User_Id', req.params.id).then(function(list){
    res.send(list);
  })
});

router.delete('/delete/:id', function(req, res){
  Adoptions().where('id', req.params.id).del().then(function(result){
    res.sendStatus(result);
  });
});

router.get('/feed', function(req, res){
  var maxHealth = 0;
  var currentHealth = 0;
  var userId = req.query.userId;
  var adoptionId = req.query.adoptionId;
  var resourceId = req.query.resourceId;

  getPetMaxHealth(adoptionId).then(function(result){
    maxHealth = result.Max_Health
  }).then(function(){
    getPetCurrentHealth(adoptionId).then(function(result){
      currentHealth = result.Current_Health;
      if (currentHealth < maxHealth) {
        currentHealth += 1;
        increasePetHealth(adoptionId, currentHealth).then(function(){
        }).then(function(){
          db_User_Resources.useResource(userId, resourceId).then(function(){
            res.send(currentHealth);
          });
        })
      } else {
        res.send('Pet at max health: ' + maxHealth)
      }
    })
  })
});

module.exports = router;
