const _Comment = require('../../models/comment.js');

const numberOfCommentsToShow = 10;

module.exports = {

  deleteAllCommentsOnBlogPost: function(id){
    return new Promise(function(resolve, reject){
      _Comment.deleteCommentsByPostId(id, function(err){
        if(err) reject(err);
        else resolve('success');
      });
    });
  },

  getBlogComments: function(post_id){
    return new Promise(function(resolve, reject){
      _Comment.getBlogComments(post_id, numberOfCommentsToShow, function(err, comments){
        if(err) reject(err);
        else resolve(comments);
      })
    })
  },

  createComment: function(newComment){
    return new Promise(function(resolve, reject){
      _Comment.createComment(newComment, function(err, blog){
        if(err) reject(err);
        else resolve(blog);
      })
    })
  },

  getCommentByPostIdAndCommentId: function(post_id, comment_id){
    return new Promise(function(resolve, reject){
      _Comment.getCommentByPostIdAndCommentId(post_id, comment_id, function(err, comment){
        if(err) reject(err);
        else resolve(comment);
      })
    })
  },

  updateCommentByPostIdAndCommentId: function(post_id, comment_id, body){
    return new Promise(function(resolve, reject){
      _Comment.updateCommentByPostIdAndCommentId(post_id, comment_id, body, function(err, comment){
        if(err) reject(err);
        else resolve(comment);
      })
    })
  },

  deleteCommentByPostIdAndCommentId: function(post_id, comment_id){
    return new Promise(function(resolve, reject){
      _Comment.deleteCommentByPostIdAndCommentId(post_id, comment_id, function(err, comment){
        if(err) reject(err);
        else resolve(comment);
      })
    })
  }

}
