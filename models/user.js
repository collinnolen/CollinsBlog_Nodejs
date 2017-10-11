const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  first_name:{
    type: String
  },
  last_name:{
    type: String
  },
  username:{
    type: String
  },
  email:{
    type: String
  },
  title:{
    type: String
  },
  password:{
    type: String
  },
  following:{
    type:Array, default: []
  }
}, {collection: 'users'});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password , salt, function(err, hash){
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}//end createUser

module.exports.getFeaturedUser = function(callback){
  User.findOne({title: 'admin'}, callback);
}//end getFeaturedUser

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}//end getUserById

module.exports.getUserByEmail = function(email, callback){
  var query = {email: email};
  User.findOne(query, callback);
}//end getUserByEmail

module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}//end getUserByUsername

module.exports.followUserByUsername = function(userToFollow, currentUser, callback){
  var query = {username: currentUser}
  User.update(query, {$push: {'following' : userToFollow}}, callback);
}

module.exports.unfollowUserByUsername = function(userToUnfollow, currentUser, callback){
  var query = {username: currentUser}
  User.update(query, {$pull: {'following' : userToUnfollow}}, callback);
}

module.exports.comparePassword = function(canidatePass, hash, callback){
  bcrypt.compare(canidatePass, hash, function(err, isMatch) {
    if(err) console.log(err); //todo
    callback(null, isMatch);
  });
}//end comparePassword
