var mongoose = require('mongoose');


var BlogSchema = mongoose.Schema({
  post_id:{
    type: String
  },
  post_author:{
    type: String
  },
  post_username:{
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

module.exports.getUserBlogsByPage = function(username, numberOfBlogsToReturnPerPage, pageNumber, callback){
  var indexesToSkip = numberOfBlogsToReturnPerPage*pageNumber;
  var query = {post_username : username};
  Blog.find(query,null,{
      limit: numberOfBlogsToReturnPerPage,
      skip: indexesToSkip,
      sort:{'post_id': -1}
    }, callback);
}

module.exports.updateBlogById = function(id, title, body, callback){
  let query = {post_id:id};
  let updates = {$set:{post_title:title, post_body:body}};
  Blog.findOneAndUpdate(query, updates, callback);
}

module.exports.deleteBlogById = function(id, callback){
  var query = {post_id : id};
  Blog.find(query).remove(callback);
}
