const Blog = require('../models/blog.js');
const _Comment = require('../models/comment.js');
const User = require('../models/user.js');

const numberOfCommentsToShow = 10;
const myBlogs_NumberOfBlogsToDisplay = 10;


module.exports.getFeaturedUser = function(){
  return new Promise(function(resolve, reject){
    User.getFeaturedUser(function(err, featureduser){
      if(err) reject(err);
      else resolve(featureduser);
    })
  });
}


module.exports.getUserByEmail = function(email){
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
}

module.exports.getUserByUsername = function(username){
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
}

module.exports.getUserBlogsByPage = function(username, pageNumber){
  return new Promise(function(resolve, reject){
    Blog.getUserBlogsByPage(username, myBlogs_NumberOfBlogsToDisplay, pageNumber, function(err, blogs){
      if(err) reject(err);
      else resolve(blogs);
    });
  });
}

module.exports.getUserBlogCount = function(username){
  return new Promise(function(resolve, reject){
    Blog.getUserBlogCountByUsername(username, function(err, blogCount){
      if(err) reject(err);
      else resolve(blogCount);
    });
  });
}

module.exports.getRecentBlogs = function(blogsToReturn){
  return new Promise(function(resolve, reject){
    Blog.getRecentBlogs(blogsToReturn, function(err, blogs){
      if(err) reject(err);
      else resolve(blogs);
    });
  });
}

module.exports.getUserFeaturedBlog = function(username){
  return new Promise(function(resolve, reject){
    Blog.getUserFeaturedBlog(username, function(err, blog){
      if(err) reject(err);
      else resolve(blog);
    });
  });
}

module.exports.getUserRecentBlogs = function(username, blogsToReturn){
  return new Promise(function(resolve, reject){
    Blog.getUserRecentBlogs(username, blogsToReturn, function(err, blogs){
      if(err) reject(err);
      else resolve(blogs);
    });
  });
}
