var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.json({ id: req.user.id, username: req.user.User_Name });
});

module.exports = router;
