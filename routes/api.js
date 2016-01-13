var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	if(Array.isArray(req.user)){
		res.json({id: req.user[0].id, username: req.user[0].User_Name});
	}else{
	res.json({ id: req.user.id, username: req.user.User_Name });
	}
});

module.exports = router;
