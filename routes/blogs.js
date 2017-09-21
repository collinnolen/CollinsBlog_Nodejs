var express = require('express');
var router = express.Router();
const microtime = require('microtime');

const Auth = require('../middleware/authentication.js');

var Blog = require('../models/blog.js');
var _Comment = require('../models/comment.js');

const numberOfCommentsToShow = 10;

//Blog routes
router.get('/', function(req, res){
  var numberOfBlogsToReturn = 5;
  Blog.getRecentBlogs(numberOfBlogsToReturn, function(err, blogs){
    res.render('blog/bloghome', {blogs: blogs});
  });
});

router.get('/:id', function(req, res){
  Blog.getBlogByPostId(req.params.id, function(err, blog){
    if(blog){
      _Comment.getBlogComments(blog.post_id, numberOfCommentsToShow, function(err, comments){
        res.render('blog/blogPage', {blog: blog, comments: comments});
      });
    }
    else{
      req.flash('error_msg', 'You need to be logged in to make a blog post.');
      res.redirect('/blogs');
    }
  });
});

router.post('/', Auth.ensureAuthenticated, function(req, res){
  if(req.user != null){
    var id = microtime.now().toString(36); //base 36 to save url space.
    var author = req.user.first_name + ' ' + req.user.last_name;
    var username = req.user.username;
    var title = req.body.title;
    var body = req.body.body;

    req.checkBody('body', 'Body of blog post is required.').notEmpty();
    req.checkBody('title', 'Blog post must have a title.').notEmpty();

    var errors = req.validationErrors();

    if(errors){
      res.render('user/dashboard',{
        errors:errors
      });
    }
    else{
      var newBlogPost= new Blog({
        post_id : id,
        post_author : author,
        post_username : username,
        //post_img : img,
        post_title : title,
        post_body : body
      });

      Blog.createBlog(newBlogPost, function(err, blog){
        if(err) console.log(err);
        else res.redirect('/blogs/'+blog.post_id);
      });
    }
  }
  else{
    req.flash('error_msg', 'You need to be logged in to make a blog post.');
    res.redirect('/users/login');
  }
});

router.delete('/:id', Auth.ensureAuthenticated, function(req, res){
  Blog.deleteBlogById(req.params.id, function(err){
    if(err) console.log(err);
    else res.send('success');
  });
});

module.exports = router;
