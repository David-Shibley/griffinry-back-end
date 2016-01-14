var express = require('express');
var router = express.Router();
var path = require('path');

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

router.get('/create.html', isAuthenticated ,  function(req, res, next) {
  res.sendFile('/create.html', { root: path.join(__dirname, '../html') });
});

router.get('/gather.html', isAuthenticated, function(req, res, next) {
  res.sendFile('/gather.html', { root: path.join(__dirname, '../html') });
});

router.get('/pets.html', isAuthenticated, function(req, res, next) {
  res.sendFile('/pets.html', { root: path.join(__dirname, '../html') });
});

module.exports = router;
