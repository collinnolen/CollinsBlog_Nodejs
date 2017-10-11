const Blog = require('../../models/blog.js');

const myBlogs_NumberOfBlogsToDisplay = 10;

module.exports = {

  getBlogByPostId: function(post_id){
    return new Promise(function(resolve, reject){
      Blog.getBlogByPostId(post_id, function(err, blog){
        if(err) reject(err);
        else resolve(blog);
      })
    })
  },

  getUserFollowingRecentBlogs: function(followingList, blogsToReturn, toSkip){
    return new Promise(function(resolve, reject){
      Blog.getUserFollowingRecentBlogs(
        followingList,
        blogsToReturn,
        toSkip,
        function(err, blogs){
          if(err) reject(err);
          else resolve(blogs);
        })
    });
  },

  getUserBlogsByPage: function(username, pageNumber){
    return new Promise(function(resolve, reject){
      Blog.getUserBlogsByPage(username, myBlogs_NumberOfBlogsToDisplay, pageNumber, function(err, blogs){
        if(err) reject(err);
        else resolve(blogs);
      });
    });
  },

  getUserBlogCount: function(username){
    return new Promise(function(resolve, reject){
      Blog.getUserBlogCountByUsername(username, function(err, blogCount){
        if(err) reject(err);
        else resolve(blogCount);
      });
    });
  },

  getRecentBlogs: function(blogsToReturn){
    return new Promise(function(resolve, reject){
      Blog.getRecentBlogs(blogsToReturn, function(err, blogs){
        if(err) reject(err);
        else resolve(blogs);
      });
    });
  },

  getUserFeaturedBlog: function(username){
    return new Promise(function(resolve, reject){
      Blog.getUserFeaturedBlog(username, function(err, blog){
        if(err) reject(err);
        else resolve(blog);
      });
    });
  },

  getUserRecentBlogs: function(username, blogsToReturn){
    return new Promise(function(resolve, reject){
      Blog.getUserRecentBlogs(username, blogsToReturn, function(err, blogs){
        if(err) reject(err);
        else resolve(blogs);
      });
    });
  },

  deleteBlogById: function(id){
    return new Promise(function(resolve, reject){
      Blog.deleteBlogById(id, function(err){
        if(err) reject(err);
        else resolve('success');
      });
    });
  },

  createBlog: function(newBlogPost){
    return new Promise(function(resolve, reject){
      Blog.createBlog(newBlogPost, function(err, blog){
        if(err) reject(err);
        else resolve(blog);
      })
    })
  },

  removeFeatured: function(username){
    return new Promise(function(resolve, reject){
      Blog.removeFeatured(username, function(err){
        if(err) reject(err);
        else resolve();
      })
    })
  }

}
