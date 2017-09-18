var mongoose = require('mongoose');


var BlogSchema = mongoose.Schema({
  post_id:{
    type: String
  },
  post_author:{
    type: String
  },
  post_img:{
    data: Buffer, contentType: String
  },
  post_title:{
    type: String
  },
  post_body:{
    type: String
  }
}, {collection: 'posts'});

var Blog = module.exports = mongoose.model('Blog', BlogSchema);

module.exports.createBlog = function(newBlog, callback){
  newBlog.save(callback);
}

module.exports.getBlogByPostId = function(postid, callback){
  var query = {post_id: postid};
  Blog.findOne(query, callback);
}

module.exports.getRecentBlogs = function(numberOfBlogsToReturn, callback){
  Blog.find({},null,{ limit: numberOfBlogsToReturn,  sort:{'post_id': -1} }, callback );
}
