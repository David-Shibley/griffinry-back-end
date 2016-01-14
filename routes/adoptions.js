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
    // for (var i = 0; i < list.length; i++) {
    //   db_Adoptions.updateHealthEnergyGains(list[i].id)
    //   .then(function(){})
    // }

    db_Adoptions.getPetList(req.params.id).then(function(returnList){
      res.send(returnList);
    })
  })
});

//http://localhost:3000/adoptions/updateStats/1
router.get('/updateStats/:adoptionId', function(req, res){
  db_Adoptions.updateHealthEnergyGains(
    req.params.adoptionId
  ).then(function(result){
    res.send(result);
  })
})

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
        res.send(currentHealth)
      }
    })
  })
});

module.exports = router;
