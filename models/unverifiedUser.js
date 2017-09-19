var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UnverifiedUserSchema = mongoose.Schema({
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
  url:{
    type: String
  }
}, {collection: 'unverifiedUsers'});

var UnverifiedUser = module.exports = mongoose.model('UnverifiedUser', UnverifiedUserSchema);

module.exports.createUnverifiedUser = function(newUnverifiedUser, callback){
  // bcrypt.genSalt(10, function(err, salt){
  //   bcrypt.hash(newUnverifiedUser.password , salt, function(err, hash){
  //     newUnverifiedUser.password = hash;
      newUnverifiedUser.save(callback);
  //   });
  // });
}//end createUser


module.exports.getUnverifiedUserById = function(id, callback){
  UnverifiedUser.findById(id, callback);
}//end getUserById

module.exports.getUnverifiedUserByUrl = function(url, callback){
  var query = {url: url};
  UnverifiedUser.findOne(query, callback);
}//end getUnverifiedUserByUrl


module.exports.removeUnverifiedUserByUrl = function(url, callback){
  UnverifiedUser.find({url: url}).remove(callback);
}
// module.exports.comparePassword = function(canidatePass, hash, callback){
//   bcrypt.compare(canidatePass, hash, function(err, isMatch) {
//     if(err) console.log(err); //todo
//     callback(null, isMatch);
//   });
// }
