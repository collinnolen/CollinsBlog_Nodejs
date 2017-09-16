var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// mongoose.connect('mongodb://localhost/collins_blog');
//
// var db = mongoose.connection;

var UserSchema = mongoose.Schema({
  first_name:{
    type: String
  },
  last_name:{
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
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password , salt, function(err, hash){
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}//end createUser


module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}//end getUserById

module.exports.getUserByEmail = function(email, callback){
  var query = {email: email};
  User.findOne(query, callback);
}//end getUserByEmail

module.exports.comparePassword = function(canidatePass, hash, callback){
  bcrypt.compare(canidatePass, hash, function(err, isMatch) {
    if(err) console.log(err); //todo
    callback(null, isMatch);
  });
}//end comparePassword
