var express = require('express');
var router = express.Router();
var passport = require('passport');
var db_User_Resources = require('../bin/db_user_resources');
var db_Adoptions = require('../bin/db_adoptions');

router.post('/add', function(req, res){
  db_Adoptions.newAdoption(req.body.userId, req.body.petId,
                           req.body.color, req.body.name)
    .then(function(id){
    res.redirect('/dashboard');
  })
});

router.get('/list/:id', function(req, res){
  db_Adoptions.getPetList(req.params.id).then(function(list){
    res.send(list);
  })
});

router.delete('/delete/:id', function(req, res){
  db_Adoptions.deleteAdoption(req.params.id).then(function(result){
    res.sendStatus(result);
  });
});

router.get('/feed', function(req, res){
  var maxHealth = 0;
  var currentHealth = 0;
  var userId = req.query.userId;
  var adoptionId = req.query.adoptionId;
  var resourceId = req.query.resourceId;

  db_Adoptions.getPetMaxHealth(adoptionId).then(function(result){
    maxHealth = result.Max_Health
  }).then(function(){
    db_Adoptions.getPetCurrentHealth(adoptionId).then(function(result){
      currentHealth = result.Current_Health;
      if (currentHealth < maxHealth) {
        currentHealth += 1;
        db_Adoptions.increasePetHealth(adoptionId, currentHealth).then(function(){
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

router.get('/count', function(req, res){
  if(Array.isArray(req.user)){
    req.user.id = req.user[0].id;
  }
  console.log('fuckfuckfuckfuckfuck');
    db_Adoptions.getPetCount(req.user.id).then(function(petNumber){
    console.log(petNumber);
    res.json(petNumber[0].count);
  });
});

module.exports = router;
