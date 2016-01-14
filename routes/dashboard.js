var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('dashboard', {message: req.query.error});
});

module.exports = router;
