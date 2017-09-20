var express = require('express');
var router = express.Router();
const microtime = require('microtime');

const Auth = require('../middleware/authentication.js');

var _Comment = require('../models/comment.js');

// posts comment to blog post with :id
router.post('/:id', Auth.ensureAuthenticated, function(req, res){
  var comment_timeposted = microtime.now();
  var comment_username = req.user.username;
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
      comment_username: comment_username,
      comment_author: comment_author,
      comment_body: comment_body
    });


    _Comment.createComment(newComment, function(err, blog){
      if(err) console.log(err);
      res.redirect('/blogs/'+req.params.id); //add message saying error occured
    });
  }
});

module.exports = router;
