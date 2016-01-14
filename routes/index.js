var express = require('express');
var router = express.Router();
var path = require('path');
var ensurePets = require('../bin/ensurePets');
var threePetRedirect = require('../bin/3petredirect');

function isAuthenticated(req, res, next){
  if (!req.isAuthenticated()){
    res.redirect('/');
  }else{
    next();
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.redirect('/dashboard');
  }
  res.sendFile('/index.html', { root: path.join(__dirname, '../html') });
});

router.get('/create.html', isAuthenticated, threePetRedirect, function(req, res, next) {
  console.log('req.user.id', req.user.id);
  console.log('reg.user', req.user);
  res.sendFile('/create.html', { root: path.join(__dirname, '../html') });
});


router.get('/gather.html',  isAuthenticated, ensurePets, function(req, res, next) {
    res.sendFile('/gather.html', { root: path.join(__dirname, '../html') });
});

router.get('/pets.html',  isAuthenticated, ensurePets, function(req, res, next) {
  res.sendFile('/pets.html', { root: path.join(__dirname, '../html') });
});

module.exports = router;
