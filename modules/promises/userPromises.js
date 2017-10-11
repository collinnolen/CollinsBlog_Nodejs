const User = require('../../models/user.js');
const UnverifiedUser = require('../../models/unverifiedUser.js');

module.exports = {

  followUserByUsername: function(userToFollow, userFollowing){
    return new Promise(function(resolve, reject){
      User.followUserByUsername(userToFollow, userFollowing, function(err){
        if(err) reject(err);
        else resolve('Success');
      })
    })
  },

  unfollowUserByUsername: function(userToUnfollow, userUnfollowing){
    return new Promise(function(resolve, reject){
      User.unfollowUserByUsername(userToUnfollow, userUnfollowing, function(err){
        if(err) reject(err);
        else resolve('Success');
      })
    })
  },

  getUserFollowingList: function(username){
    return new Promise(function(resolve, reject){
      User.getUserFollowingList(username, function(err, list){
        if(err) reject(err);
        else resolve(list);
      })
    })
  },

  getFeaturedUser: function(){
    return new Promise(function(resolve, reject){
      User.getFeaturedUser(function(err, featureduser){
        if(err) reject(err);
        else resolve(featureduser);
      })
    });
  },

  getUserByEmail: function(email){
    return new Promise(function(resolve, reject){
      User.getUserByEmail(email, function(err, user){
        if(err)
        reject(err);
        else{
          if(user == null){
            resolve('null');
          }
          else
          resolve(user);
        }
      });
    });
  },

  getUserByUsername: function(username){
    return new Promise(function(resolve, reject){
      User.getUserByUsername(username, function(err, user){
        if(err)
        reject(err);
        else{
          if(user == null)
          resolve('null');
          else
          resolve(user);
        }
      });
    });
  },

  comparePassword: function(password, user_password){
    return new Promise(function(resolve, reject){
      User.comparePassword(password, user_password, function(err, isMatch){
        if(err) reject(err);
        else resolve(isMatch);
      })
    })
  },

  createUser: function(verifiedUser){
    return new Promise(function(resolve, reject){
      User.createUser(verifiedUser, function(err, user){
        if(err) reject(err);
        else resolve(user);
      })
    })
  },

  getUserById: function(id){
    return new Promise(function(resolve, reject){
      User.getUserById(id, function(err, user){
        if(err){
          reject(err);
        }
        else resolve(user);
      })
    })
  }
}
