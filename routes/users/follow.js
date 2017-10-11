const express = require('express');
const router = express.Router();

//Custom Modules
const QueryUtility = require('../../modules/queryUtility.js');
const Auth = require('../../middleware/authentication.js');
const FileUtility = require('../../modules/fileUtility.js');
const PromiseUtil = require('../../modules/promises.js');
const Util = require('../../modules/generalUtilities.js');

//Mongoose Models
const User = require('../../models/user.js');

router.get('/:user_username', Auth.ensureAuthenticated, function(req, res){
  let followUser = req.params.user_username;
  let currentUser = req.user.username;

  //fetch both user and user-to-follow from database.
  Promise.all([
    PromiseUtil.getUserByUsername(followUser),
    PromiseUtil.getUserByUsername(currentUser)
  ])
  //fetch success
  .then((values) => {
    let userToFollow = values[0];
    let followingList = values[1].following;

    if(userToFollow === 'null'){
      req.flash('error_msg', 'User ' + followUser + ' does not exist.');
      res.redirect('back');
    }
    else if(Util.arrayHasObject(followingList, userToFollow)){
      req.flash('error_msg', 'You are already following user ' + userToFollow.username +'.');
      res.redirect('back');
    }
    else{
      Promise.Util.followUserByUsername(userToFollow, currentUser)
        .then(() =>{
          req.flash('success_msg', 'You are now following user ' + userToFollow.username + '.');
          res.redirect('back');
        })
        .catch((err)=>{
          console.log(err);
          req.flash('error_msg', 'Could not follow user ' + userToFollow.username +'.');
          res.redirect('back');
        })
    }
  })
  //failed fetch
  .catch((errors) =>{
    console.log(errors);
  })
});


router.delete('/:user_username', function(req, res){
  let userToUnfollow = req.params.user_username;
  let currentUser = req.user.username;

  PromiseUtil.unfollowUserByUsername(userToUnfollow, currentUser)
    .then(() => {
      req.flash('success_msg', 'You are no longer following user ' + userToUnfollow + '.');
      res.send('success');
      console.log('success');
    })
    .catch((error) => {
      console.log(error);
      req.flash('error_msg', 'Could not unfollow user ' + userToUnfollow +'.');
      res.send(error);
    })
});

module.exports = router;
