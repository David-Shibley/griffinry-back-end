var knex = require('../db/knex');

function User_Resources(){
  return knex('user_resources');
};

function Update_Quantity(userId, resourceId, quantity){
  return User_Resources().where({
    User_Id: userId,
    Resource_Id: resourceId
  }).update({'Quantity': quantity})
};

function Delete_Resource(userId, resourceId){
  return User_Resources().where({
    'User_Id': userId,
    'Resource_Id': resourceId
  }).del()
};

function Get_Quantity(userId, resourceId){
  return User_Resources().where({
    'User_Id': userId,
    'Resource_Id': resourceId
  }).first().select('Quantity')
};

function Add_New(userId, resourceId){
  return User_Resources().insert({
    User_Id: userId,
    Resource_Id: resourceId,
    Quantity: 1
  })
};

module.exports = {

  useResource: function(userId, resourceId){
    return Get_Quantity(userId, resourceId).then(function(result){
      var quantity = Number(result.Quantity);
      if (quantity == 1) {
        Delete_Resource(userId, resourceId).then(function(result){})
      } else {
        quantity -= 1;
        Update_Quantity(userId, resourceId, quantity).then(function(result){})
      }
    })
  },

  getUserResourcesCount: function(userId, resourceId){
    return User_Resources().where({
      'User_Id': userId,
      'Resource_Id': resourceId
    }).count()
  },

  getUserResources: function(userId){
    return knex.select('*')
    .from('user_resources')
    .leftJoin('resources', 'user_resources.Resource_Id', 'resources.id')
    .where('User_Id', userId)
  },

  insertNewUserResource: function(userId, resourceId){
    return Add_New(userId, resourceId)
  },

  getUserResourceQuantity: function(userId, resourceId){
    return Get_Quantity(userId, resourceId)
  },

  deleteUserResource: function(userId, resourceId){
    return Delete_Resource(userId, resourceId)
  },

  updateUserResourceQuantity: function(userId, resourceId, quantity){
    return Update_Quantity(userId, resourceId, quantity)
  }

}
