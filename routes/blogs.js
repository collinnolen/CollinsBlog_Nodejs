const express = require('express');
const router = express.Router();
const microtime = require('microtime');

const Auth = require('../middleware/authentication.js');

const Blog = require('../models/blog.js');
const _Comment = require('../models/comment.js');

const numberOfCommentsToShow = 10;

//Blog routes
router.get('/', function(req, res){
  var numberOfBlogsToReturn = 5;
  Blog.getRecentBlogs(numberOfBlogsToReturn, function(err, blogs){
    res.render('blog/bloghome', {stylesheet: 'blog/bloghome', blogs: blogs});
  });
});

router.get('/:id', function(req, res){
  var username;
  if(req.user === undefined)
    username = undefined;
  else
    username = req.user.username;

  Blog.getBlogByPostId(req.params.id, function(err, blog){
    if(req.query.json != null){
      res.send(JSON.stringify(blog));
    }
    else if(blog){
      _Comment.getBlogComments(blog.post_id, numberOfCommentsToShow, function(err, comments){
        res.render('blog/blogPage', {stylesheet: 'blog/blogPage', user: username, blog: blog, comments: comments});
      });
    }
    else{
      req.flash('error_msg', 'Blog post ' + req.params.id + ' does not exist.');
      res.redirect('/blogs');
    }
  });
});

router.post('/', Auth.ensureAuthenticated, function(req, res){
  var time = microtime.now().toString().substr(0,13);
  var id = Number(time).toString(36); //base 36 to save url space.
  var author = req.user.first_name + ' ' + req.user.last_name;
  var username = req.user.username;
  var title = req.body.title;
  var body = req.body.body;
  var featured;

  //assigns boolean to checkbox value
  if(req.body.featured)
    featured = true;
  else
    featured = false;

  req.checkBody('body', 'Body of blog post is required.').notEmpty();
  req.checkBody('title', 'Blog post must have a title.').notEmpty();

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
          var errors = result.array().map(function (elem) {
              return elem.msg;
          });
          console.log('There are following validation errors: ' + errors.join('&&'));
          res.render('user/dashboard/createblog', { errors: errors });
    }
    else{
      var newBlogPost= new Blog({
        post_id : id,
        post_author : author,
        post_username : username,
        //post_img : img,
        post_title : title,
        post_body : body,
        post_featured : featured
      });

      if(featured === true){
        Blog.removeFeatured(function(){
          Blog.createBlog(newBlogPost, function(err, blog){
            if(err) console.log(err);
            else res.redirect('/blogs/'+blog.post_id);
          });
        });
      }
      else{
        Blog.createBlog(newBlogPost, function(err, blog){
          if(err) console.log(err);
          else res.redirect('/blogs/'+blog.post_id);
        });
      }//end else
    }//end else
  });
});

router.delete('/:id', Auth.ensureAuthenticated, function(req, res){
  Blog.deleteBlogById(req.params.id, function(err){
    if(err) console.log(err);
    else res.send('success');
  });
});

router.put('/:id', Auth.ensureAuthenticated, function(req, res){
  var id = req.params.id;
  if(req.query.featured === 'true'){

    var featured = true;

    Blog.removeFeatured(function(err){
      if(err) res.send(err);
      else Blog.makeFeatured(id, function(){
        res.send('success');
      });
    })
  }
  else{

    var body = req.body.body;
    var title = req.body.title;

    req.checkBody('body', 'Body of blog post is required.').notEmpty();
    req.checkBody('title', 'Blog post must have a title.').notEmpty();

    let errors = req.validationErrors();

    if(errors){
      res.render('/user/dashboard/myblogs',{
        stylesheet: 'user/dashboard/myblogs',
        errors:errors
      });
    }
    else{
      Blog.updateBlogById(id, title, body, function(err, blog){
        if(err) console.log(err);
        else res.send('success');
      });
    }
  }
});

module.exports = router;
