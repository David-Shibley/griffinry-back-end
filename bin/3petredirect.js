var knex = require('../db/knex');

function threePetRedirect(req, res, next){
  var currentUser = req.user.id || req.user[0].id;
  knex('adoptions').count().where('User_Id', currentUser).then(function(petNumber){
    if(parseInt(petNumber[0].count) >= 3){
      var message = "No more pets for you!"
      res.redirect('/dashboard?error=' + message);
    }else{
      next();
    }
  });
}

module.exports = threePetRedirect;
