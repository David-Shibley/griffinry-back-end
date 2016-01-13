var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');

function Resources(){
  return knex('resources')
};

function User_Resources(){
  return knex('user_resources');
}

function Adoptions(){
  return knex('adoptions');
}

function getRandomRarity(){
  var randomNumber = getRandomInt(1, 100);

  if (randomNumber <= 85) {
    return "Common";
  } else if (randomNumber > 85 && randomNumber < 99) {
    return "Rare";
  } else {
    return "Epic";
  }
};

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function reducePetEnergy(adoptionId){
  return Adoptions().select('Current_Energy').where('id', adoptionId).first()
  .then(function(result){
    var energy = result.Current_Energy;
    if (energy > 0) {
      energy -= 1;
      Adoptions().where({'id': adoptionId})
      .update({'Current_Energy': energy})
      .then(function(){});
    }
  })
}

function getUserResourcesCount(userId, resourceId){
  return User_Resources().where({
    'User_Id': userId,
    'Resource_Id': resourceId
  }).count()
}

function getUserResourceQuantity(userId, resourceId){
  return User_Resources().where({
    'User_Id': userId,
    'Resource_Id': resourceId
  }).first().select('Quantity')
};

function updateUserResourceQuantity(userId, resourceId, quantity){
  return User_Resources().where({
    User_Id: userId,
    Resource_Id: resourceId
  }).update({'Quantity': quantity})
};

function insertNewUserResource(userId, resourceId){
  return User_Resources().insert({
    User_Id: userId,
    Resource_Id: resourceId,
    Quantity: 1
  })
};

function deleteUserResource(userId, resourceId){
  return User_Resources().where({
    'User_Id': userId,
    'Resource_Id': resourceId
  }).del()
};

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
  Resources().select().where('Rarity', randRarity)
  .then(function(list){
    var randomNumber = getRandomInt(0, list.length-1);
    resourceId = list[randomNumber].id;
    returnObject.resource = list[randomNumber];
  })
  .then(function(){
    getUserResourcesCount(userId, resourceId)
    .then(function(result){
      var currentCount = Number(result[0].count);
      if (currentCount === 0) {
        insertNewUserResource(userId, resourceId)
        .then(function(result){
          returnObject.newQuantity = 1;
          res.send(returnObject)
        })
      } else {
        getUserResourceQuantity(userId, resourceId)
        .then(function(result){
          var quantity = result.Quantity;
          quantity += 1;
          updateUserResourceQuantity(userId, resourceId, quantity)
          .then(function(result){
            returnObject.newQuantity = quantity;
            res.send(returnObject);
          })
        })
      } // end if statement
    }).then(function(){
      reducePetEnergy(adoptionId);
    })
  })
});

router.get('/list/:id', function(req, res){
  knex.select('*')
  .from('user_resources')
  .leftJoin('resources', 'user_resources.Resource_Id', 'resources.id')
  .where('User_Id', req.params.id)
  .then(function(result){
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

  getUserResourceQuantity(userId, resourceId)
  .then(function(result){
    var quantity = result.Quantity;
    if (quantity == 1) {
      deleteUserResource(userId, resourceId)
      .then(function(result){
        res.send(result);
      })
    } else {
      quantity -= 1;
      updateUserResourceQuantity(userId, resourceId, quantity)
      .then(function(result){
        res.send(result)
      })
    }
  })
});

module.exports = router;
