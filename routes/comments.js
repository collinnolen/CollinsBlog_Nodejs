var express = require('express');
var router = express.Router();
const microtime = require('microtime');

var _Comment = require('../models/comment.js');

router.post('/:id', ensureAuthenticated, function(req, res){
  var comment_timeposted = microtime.now();
  var comment_body = req.body.comment;
  var comment_author = req.user.first_name + ' ' + req.user.last_name;

  req.checkBody('comment', 'Comment can not be empty.').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.redirect('back',{
      errors:errors
    });
  }
  else{
    var newComment = new _Comment({
      post_id: req.params.id,
      comment_timeposted: comment_timeposted,
      comment_author: comment_author,
      comment_body: comment_body
    });


    _Comment.createComment(newComment, function(err, blog){
      if(err) console.log(err);
      res.redirect('/blogs/'+req.params.id); //add message saying error occured
    });
  }
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      req.flash('error_msg', 'You are not logged in');
      res.redirect('/users/login');
    }
}


module.exports = router;
