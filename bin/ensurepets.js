var knex = require('../db/knex');

function ensurePets(req, res, next){
  var currentUser = req.user.id;
  knex('adoptions').count().where('User_Id', currentUser).then(function(petNumber){
    console.log('petnumber' , petNumber[0].count);
    if(parseInt(petNumber[0].count) === 0){
      res.redirect('/create.html');
    }else{
      next();
    }
  });
}

module.exports = ensurePets;
