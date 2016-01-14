var knex = require('../db/knex');

function ensurePets(req, res, next){
  var currentUser = req.user.id || req.user[0].id;
  knex('adoptions').count().where('User_Id', currentUser).then(function(petNumber){
    console.log('currentUser', currentUser);
    if(parseInt(petNumber[0].count) === 0){
      res.redirect('/create.html');
    }else{
      next();
    }
  });
}

module.exports = ensurePets;
