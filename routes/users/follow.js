const express = require('express');
const router = express.Router();

//Custom Modules
const QueryUtility = require('../../modules/queryUtility.js');
const Auth = require('../../middleware/authentication.js');
const FileUtility = require('../../modules/fileUtility.js');
const Util = require('../../modules/generalUtilities.js');
const User = require('../../modules/promises/userPromises.js');


router.get('/:user_username', Auth.ensureAuthenticated, function(req, res){
  let followUser = req.params.user_username;
  let currentUser = req.user.username;

  if (req.params.user_username === req.user.username){
    req.flash('error_msg', 'You cannot follow yourself!');
    res.redirect('back');
    return;
  }

  //fetch both user and user-to-follow from database.
  Promise.all([
    User.getUserByUsername(followUser),
    User.getUserByUsername(currentUser)
  ])
  //fetch success
  .then((values) => {
    let userToFollow = (values[0] === 'null') ? 'null' : values[0].username;
    let followingList = values[1].following;

    if(userToFollow === 'null'){
      req.flash('error_msg', 'User ' + followUser + ' does not exist.');
      res.redirect('back');
    }
    else if(Util.arrayHasObject(followingList, userToFollow)){
      req.flash('error_msg', 'You are already following user ' + userToFollow +'.');
      res.redirect('back');
    }
    else{
      User.followUserByUsername(userToFollow, currentUser)
        .then(() =>{
          req.flash('success_msg', 'You are now following user ' + userToFollow + '.');
          res.redirect('back');
        })
        .catch((err)=>{
          console.log(err);
          req.flash('error_msg', 'Could not follow user ' + userToFollow +'.');
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

  User.unfollowUserByUsername(userToUnfollow, currentUser)
    .then(() => {
      req.flash('success_msg', 'You are no longer following user ' + userToUnfollow + '.');
      res.send('success');
    })
    .catch((error) => {
      console.log(error);
      req.flash('error_msg', 'Could not unfollow user ' + userToUnfollow +'.');
      res.send(error);
    })
});

module.exports = router;
