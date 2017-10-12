const express = require('express');
const router = express.Router();
const validator = require('validator');
const microtime = require('microtime');

//middleware
const Auth = require('../middleware/authentication.js');
const QueryChecker = require('../middleware/queryChecker.js');
const _Comment = require('../modules/promises/commentPromises.js');

//comment Model
const CommentModel = require('../models/comment.js')

// posts comment to blog post with :id
router.post('/:id', Auth.ensureAuthenticated, function(req, res){
  let comment_timeposted = Number(microtime.now().toString().substr(0,13));
  let comment_username = req.user.username;
  let comment_body = req.body.comment;
  let comment_author = req.user.first_name + ' ' + req.user.last_name;

  req.checkBody('comment', 'Comment can not be empty.').notEmpty();
  req.check('comment', 'Comment can not be longer than 1000 characters.')
    .isLength({min:1, max:1000});

  let comment_sanatize = validator.escape(comment_body);

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      var errors = result.array().map(function (elem) { return elem.msg; });
      res.redirect('back',{
        errors:errors
      });
    }
    else{
      var newComment = new CommentModel({
        post_id: req.params.id,
        comment_timeposted: comment_timeposted,
        comment_username: comment_username,
        comment_author: comment_author,
        comment_body: comment_sanatize
      });

      _Comment.createComment(newComment)
        .then(function(blog){
          res.redirect('/blogs/'+req.params.id);
        })
        .catch(function(err){
          console.log(err);
        })
    }
  });
});

router.get('/:id', QueryChecker.commentAndPostId, function(req, res){
  _Comment.getCommentByPostIdAndCommentId(req.query.post_id, req.params.id)
    .then(function(comment){
      res.send(JSON.stringify(comment));
    })
    .catch(function(err){
      console.log(err);
      res.send('Error has occured');
    })
});

router.put('/:id', QueryChecker.postId, Auth.ensureAuthenticated, function(req, res){
  var body = req.body.comment_body;

  req.checkBody('comment_body', 'Body of the comment can not be empty.').notEmpty();

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      var errors = result.array().map(function (elem) { return elem.msg; });
      res.redirect('/blog/blogPage/' + req.query.post_id,{
        errors: errors
      });
    }
    else{
      _Comment.updateCommentByPostIdAndCommentId(req.query.post_id, req.params.id, body)
        .then(function(comment){
          res.send('Success');
        })
        .catch(function(err){
          res.send(err);
        })
    }
  });


});

router.delete('/:id', Auth.ensureAuthenticated, function(req, res){
  var comment_id = req.params.id;
  if(req.query.postid === undefined){
    res.send('Post id was not included.');
  }
  else{
    var post_id = req.query.postid;
    _Comment.deleteCommentByPostIdAndCommentId(post_id, comment_id)
      .then(function(comment){
        if(comment.result.n === 0){
          req.flash('error_msg', 'Comment ' + comment_id + ' couldn\'t be deleted from post ' + post_id +'.');
          res.send('Failed to delete comment '+ comment_id);
        }
        else{
          req.flash('success_msg', 'Comment ' + comment_id + ' successfully deleted from post ' + post_id +'.')
          res.send('Successfully delete comment ' + comment_id + ' from post '+ post_id + '.');
        }
      })
      .catch(function(err){
        res.send(err);
      })
  }
});

module.exports = router;
