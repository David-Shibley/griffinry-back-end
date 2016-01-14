var express = require('express');
var router = express.Router();
var passport = require('passport');
var db_User_Resources = require('../bin/db_user_resources');
var db_Resources = require('../bin/db_resources');
var db_Adoptions = require('../bin/db_adoptions');

function getRandomRarity(){
  var randomNumber = getRandomInt(1, 100);

  if (randomNumber <= 85) {
    return "Common";
  } else if (randomNumber > 85 && randomNumber < 100) {
    return "Rare";
  } else {
    return "Epic";
  }
};

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function reducePetEnergy(adoptionId){
  return db_Adoptions.getCurrentEnergy(adoptionId).then(function(result){
    var energy = result.Current_Energy;
    if (energy > 0) {
      energy -= 1;
      db_Adoptions.setCurrentEnergy(adoptionId, energy).then(function(){});
    }
  })
}

router.get('/gather', function(req, res) {
  if (req.query.userId === undefined) {
    res.send("ERROR: A userId is reqiured on the query string.");
  }

  if (req.query.adoptionId === undefined) {
    res.send("ERROR: A adoptionId is reqiured on the query string.");
  }

  if (req.query.locationId === undefined) {
    res.send("ERROR: A locationId is reqiured on the query string.");
  }

  var userId = req.query.userId;
  var adoptionId = req.query.adoptionId;
  var locatioinId = req.query.locationId;
  var resourceId = 0;
  var returnObject = {};

  var randRarity = getRandomRarity();
  db_Resources.getResourceList(randRarity).then(function(list){
    var randomNumber = getRandomInt(0, list.length-1);
    resourceId = list[randomNumber].id;
    returnObject.resource = list[randomNumber];
  }).then(function(){
    db_User_Resources.getUserResourcesCount(userId, resourceId)
    .then(function(result){
      var currentCount = Number(result[0].count);
      if (currentCount === 0) {
        db_User_Resources.insertNewUserResource(userId, resourceId)
        .then(function(result){
          returnObject.newQuantity = 1;
          res.send(returnObject)
        })
      } else {
        db_User_Resources.getUserResourceQuantity(userId, resourceId)
        .then(function(result){
          var quantity = result.Quantity;
          quantity += 1;
          db_User_Resources.updateUserResourceQuantity(userId, resourceId, quantity).then(function(result){
            returnObject.newQuantity = quantity;
            res.send(returnObject);
          })
        })
      } // end if statement
    }).then(function(){
      reducePetEnergy(adoptionId);
    }).then(function(){
      db_Adoptions.increaseExperience(adoptionId, 1).then(function(){
      });
    })
  })
});

router.get('/list/:id', function(req, res){
  db_User_Resources.getUserResources(req.params.id).then(function(result){
    res.send(result);
  });
});

router.get('/use', function(req, res){
  if (req.query.userId === undefined) {
    res.send("ERROR: A userId is reqiured on the query string.");
  }

  if (req.query.resourceId === undefined) {
    res.send("ERROR: A resourceId is reqiured on the query string.");
  }

  var userId = req.query.userId;
  var resourceId = req.query.resourceId;

  db_User_Resources.useResource(userId, resourceId).then(function(result){
    res.send(result);
  });
});

module.exports = router;
