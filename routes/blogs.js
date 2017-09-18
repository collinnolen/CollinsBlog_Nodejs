var express = require('express');
var router = express.Router();
const microtime = require('microtime');

var Blog = require('../models/blog.js');

//Get home
router.get('/', function(req, res){
  var numberOfBlogsToReturn = 5;
  Blog.getRecentBlogs(numberOfBlogsToReturn, function(err, blogs){
    res.render('blog/bloghome', {blogs: blogs});
  });

  //res.render('bloghome');
});


router.get('/:id', function(req, res){
  Blog.getBlogByPostId(req.params.id, function(err, blog){
    if(blog){
      res.render('blogPage', {blog: blog});
    }
    else{
      req.flash('error_msg', 'You need to be logged in to make a blog post.');
      res.redirect('/blogs');
    }
  });
});

//post a blog
router.post('/', function(req, res){
  if(req.user != null){
    var id = microtime.now();
    var author = req.user.first_name + ' ' + req.user.last_name;
    var title = req.body.title;
    var body = req.body.body;

    req.checkBody('body', 'Body of blog post is required.').notEmpty();

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

module.exports = router;
