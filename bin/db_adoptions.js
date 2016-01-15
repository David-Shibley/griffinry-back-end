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

function Get_Max_Energy(adoptionId){
  return Adoptions()
         .where('id', adoptionId)
         .select('Max_Energy')
         .first()
};

function Set_Last_Updated(adoptionId){
  var currentDateTime = new Date();
  return Adoptions()
         .where('id', adoptionId)
         .update('Last_Updated', currentDateTime)
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

function Get_Current_Health(adoptionId){
  return Adoptions().where('id', adoptionId).select('Current_Health').first()
};

function Set_Current_Health(adoptionId, amount){
  return Adoptions().where('id', adoptionId).update('Current_Health', amount)
};

function Update_Stats_For_Adoption(adoptionId){
  var healthUpdateRateSec = 1 / 10800; // one every 3 hours
  var energyUpdateRateSec = 1 / 3600; // one every hour
  var secondsSinceLastUpdate = 0;

  var dateNow = new Date();
  return Get_Last_Updated(adoptionId).then(function(result){
    secondsSinceLastUpdate = Math.abs(dateNow - result.Last_Updated);
    secondsSinceLastUpdate = Math.round(secondsSinceLastUpdate / 1000);

  }).then(function(){

    // update health
    Get_Current_Health(adoptionId).then(function(result){
      var currentHealth = result.Current_Health;
      var newHealth = currentHealth - (secondsSinceLastUpdate * healthUpdateRateSec);
      if (newHealth < 0) {
        newHealth = 0;
      }
      Set_Current_Health(adoptionId, newHealth).then(function(){});
    })

  }).then(function(){

    // update energy
    var maxEnergy = 0;
    Get_Max_Energy(adoptionId).then(function(result){
      maxEnergy = result.Max_Energy;

    }).then(function(){
      return Get_Current_Energy(adoptionId).then(function(result){
        var currentEnergy = Number(result.Current_Energy);
        var newEnergy = currentEnergy + (secondsSinceLastUpdate * energyUpdateRateSec);
        if (newEnergy > maxEnergy) {
          newEnergy = maxEnergy;
        }
        Set_Current_Energy(adoptionId, newEnergy).then(function(){});
      }).then(function(){
        // update last updated field
        return Set_Last_Updated(adoptionId).then(function(){});
      })
    })
  })
};

function Get_Pet_List(userId){
  return Adoptions().select().where('User_Id', userId)
};


module.exports = {
  getPetMaxHealth: function(adoptionId){
    return Adoptions().where('id', adoptionId).select('Max_Health').first()
  },

  getPetCurrentHealth: function(adoptionId){
    return Get_Current_Health(adoptionId)
  },

  setPetCurrentHealth: function(adoptionId, amount){
    return Set_Current_Health(adoptionId, amount)
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
    return Get_Pet_List(userId)
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

  updatePetListStatistics: function(userId){
    return Get_Pet_List(userId).then(function(list){
      var promises = list.map(function(item) {
        return Update_Stats_For_Adoption(item.id);
      });
      return Promise.all(promises);
    })
  },

  getPetCount: function(id){
    return Adoptions().count().where('User_Id', id);
  },

  increasePetHealth: function(adoptionId, newHealth){
    return Set_Current_Health(adoptionId, newHealth)
  }
}
