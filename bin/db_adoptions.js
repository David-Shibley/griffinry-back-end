var knex = require('../db/knex');

function Adoptions(){
  return knex('adoptions')
};

function Get_Experience(adoptionId){
  return Adoptions()
         .where('id', adoptionId)
         .select('Experience')
         .first()
};

function Set_Experience(adoptionId, amount){
  return Adoptions()
         .where('id', adoptionId)
         .update('Experience', amount)
};

function Get_Last_Updated(adoptionId){
  return Adoptions()
         .where('id', adoptionId)
         .select('Last_Updated')
         .first()
};

function Set_Last_Updated(adoptionId){
  return Adoptions()
         .where('id', adoptionId)
         .update('Last_Updated', amount)
};

function Get_Current_Energy(adoptionId){
  return Adoptions()
         .select('Current_Energy')
         .where('id', adoptionId)
         .first()
};

function Set_Current_Energy(adoptionId, energy){
  return Adoptions()
         .where({'id': adoptionId})
         .update({'Current_Energy': energy})
};


module.exports = {
  getPetMaxHealth: function(adoptionId){
    return Adoptions().where('id', adoptionId).select('Max_Health').first()
  },

  getPetCurrentHealth: function(adoptionId){
    return Adoptions().where('id', adoptionId).select('Current_Health').first()
  },

  increasePetHealth: function(adoptionId, amount){
    return Adoptions().where('id', adoptionId).update('Current_Health', amount)
  },

  newAdoption: function(userId, petId, color, name){
    return Adoptions().insert({
      User_Id: userId,
      Pet_Id: petId,
      Color: color,
      Name: name,
      Experience: 0,
      Max_Health: 10,
      Max_Energy: 5,
      Current_Health: 10,
      Current_Energy: 5,
      Last_Updated: new Date()
    }, 'id')
  },

  getPetList: function(userId){
    return Adoptions().select().where('User_Id', userId)
  },

  deleteAdoption: function(adoptionId){
    return Adoptions().where('id', adoptionId).del()
  },

  getCurrentEnergy: function(adoptionId){
    return Get_Current_Energy(adoptionId)
  },

  setCurrentEnergy: function(adoptionId, energy){
    return Set_Current_Energy(adoptionId, energy)
  },

  increaseExperience: function(adoptionId, newExperience){
    var experience = 0;
    return Get_Experience(adoptionId).then(function(result){
      experience = result.Experience;
      experience += newExperience;
      Set_Experience(adoptionId, experience).then(function(){
      })
    })
  },

  updateHealthEnergyGains: function(adoptionId){
    var dateNow = new Date();
    dateNow.setMinutes(0,0,0);
    return Get_Last_Updated(adoptionId).then(function(result){
      var hoursSinceLastUpdate = Math.abs(dateNow - result.Last_Updated);
      hoursSinceLastUpdate = Math.round(hoursSinceLastUpdate / 3600000);

      if (hoursSinceLastUpdate >= 1) {
        console.log(hoursSinceLastUpdate);
      }
    })
  }
}
