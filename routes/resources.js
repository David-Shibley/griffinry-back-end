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

router.get('/gather', function(req, res) {
  var randRarity = getRandomRarity();
  Resources().select().where('Rarity', randRarity).then(function(list){
    var randomNumber = getRandomInt(0, list.length-1);
    returnValue = list[randomNumber];
    res.send(returnValue);
  });
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

module.exports = router;
