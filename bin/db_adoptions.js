var knex = require('../db/knex');

function Adoptions(){
  return knex('adoptions')
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
    return Adoptions()
           .select('Current_Energy')
           .where('id', adoptionId)
           .first()
  },

  setCurrentEnergy: function(adoptionId, energy){
    return Adoptions()
           .where({'id': adoptionId})
           .update({'Current_Energy': energy})
  }
}
