var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');

function Pets(){
  return knex('pets');
}

function Colors(){
  return knex('pet_colors');
}

router.get('/list', function(req, res){
  var returnObject = {};

  Pets().select().then(function(speciesList){
    var speciesArray = []
    for (var i = 0; i < speciesList.length; i++) {
      speciesArray.push(speciesList[i].Type)
    }
    returnObject.species = speciesArray;
  }).then(function(){
    Colors().select().then(function(colorList){
      var colorArray = []
      for (var i = 0; i < colorList.length; i++) {
        colorArray.push(colorList[i].Color)
      }
      returnObject.colors = colorArray;
      res.send(returnObject)
    })
  })
})

module.exports = router;
