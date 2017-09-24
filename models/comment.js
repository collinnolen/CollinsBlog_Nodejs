var mongoose = require('mongoose');


var CommentSchema = mongoose.Schema({
  post_id:{
    type: String
  },
  comment_timeposted:{
    type: String
  },
  comment_username:{
    type: String
  },
  comment_author:{
    type: String
  },
  comment_body:{
    type: String
  }
}, {collection: 'comments'});

var _Comment = module.exports = mongoose.model('_Comment', CommentSchema);

module.exports.createComment = function(newComment, callback){
  newComment.save(callback);
}

module.exports.deleteCommentsByPostId = function(postid, callback){
  _Comment.find({post_id: postid}).remove(callback);
}

module.exports.deleteCommentByPostIdAndCommentId = function(postid, commentid, callback){

}

module.exports.getBlogComments = function(postid, numberOfCommentsToReturn, callback){
  _Comment.find({post_id: postid},null,{ limit: numberOfCommentsToReturn,  sort:{'comment_timeposted': -1} }, callback );
}
