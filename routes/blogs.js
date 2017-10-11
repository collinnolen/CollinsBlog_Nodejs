const express = require('express');
const router = express.Router();
const microtime = require('microtime');

//middleware
const Auth = require('../middleware/authentication.js');

//custom modules
const User = require('../modules/promises/userPromises.js');
const Blog = require('../modules/promises/blogPromises.js');
const _Comment = require('../modules/promises/commentPromises.js');
const FileUtility = require('../modules/fileUtility.js');

//models
const BlogModel = require('../models/blog.js');
const Image = require('../models/image.js');

const numberOfCommentsToShow = 10;

//Blog routes
router.get('/', function(req, res){
  var numberOfBlogsToReturn = 5;

  User.getFeaturedUser().then(function(user){
    Promise.all([
      Blog.getRecentBlogs(15)
    ])
    .then(function(values){
      res.render('blog/bloghome',{
        stylesheet: 'blog/bloghome',
        blogs: values[0],
      });
    }).catch(function(err){
      console.log(err);
    });
  }).catch(function(err){
    console.log(err);
  });
});

router.get('/:id', function(req, res){
  var user;
  if(req.user === undefined)
    user = undefined;
  else
    user = req.user;

  Blog.getBlogByPostId(req.params.id)
    .then(function(blog){
      if(req.query.json != null){
        res.send(JSON.stringify(blog));
      }
      else if(blog){
        _Comment.getBlogComments(blog.post_id, numberOfCommentsToShow)
          .then(function(comments){
            res.render('blog/blogPage', {
              stylesheet: 'blog/blogPage',
              user: user,
              blog: blog,
              script : 'followingScript',
              comments: comments
            });
          })
          .catch(function(error){
            console.log(error);
          })
      }
      else{
        req.flash('error_msg', 'Blog post ' + req.params.id + ' does not exist.');
        res.redirect('/blogs');
      }
    }).catch(function(error){
      console.log(error);
      res.send(error);
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
          var errors = result.array().map(function (elem) { return elem.msg; });
          res.render('user/dashboard/createblog', { errors: errors });
    }
    else{
      var newBlogPost= new BlogModel({
        post_id : id,
        post_author : author,
        post_username : username,
        post_title : title,
        post_body : body,
        post_featured : featured
      });

      if(!req.files)
        console.log('no files');
      else {
        Image.writeFileToServer(req.files.picture, username, id, 'BlogPicture', function(err, filename){
          if(err) console.log(err);
          Image.writeImageToDb(filename, username, id, function(err, filename){
            if(err) console.log(err);
            FileUtility.cleanUploadFiles(filename, function(err){
              if(err) return console.log(err);
              console.log('File deleted');
            });
          });
        });
      }

      if(featured === true){
        Blog.removeFeatured(req.user.username)
          .then(function(){
            Blog.createBlog(newBlogPost)
            .then(function(blog){
              res.redirect('/blogs/'+blog.post_id);
            })
            .catch(function(err){
              console.log(err);
            })
          })
      }
      else{
        Blog.createBlog(newBlogPost)
        .then(function(blog){
          res.redirect('/blogs/'+blog.post_id);
        })
        .catch(function(err){
          console.log(err);
        })
      }//end else
    }//end else
  });
});

router.delete('/:id', Auth.ensureAuthenticated, function(req, res){
  Promise.all([
    Blog.deleteBlogById(req.params.id),
    _Comment.deleteAllCommentsOnBlogPost(req.params.id)
  ])
  .then(function(values){
    req.flash('success_msg', 'Successfully removed blog post ' + req.params.id + '.');
    res.send('success');
  })
  .catch(function(err){
    req.flash('error_msg', 'Could not remove blog post ' + req.params.id + '.');
    res.send('failed');
  });
});

router.put('/:id', Auth.ensureAuthenticated, function(req, res){
  var id = req.params.id;
  if(req.query.featured === 'true'){
    var featured = true;

    Blog.removeFeatured(req.user.username, function(err){
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

    //let errors = req.validationErrors();
    req.getValidationResult().then(function(result){
      if(!result.isEmpty()){
        var errors = result.array().map(function (elem) { return elem.msg; });
        res.render('user/dashboard/myblogs',{
          stylesheet: 'user/dashboard/myblogs',
          errors: errors
        });
      }
      else{
        Blog.updateBlogById(id, title, body, function(err, blog){
          if(err) console.log(err);
          else res.send('success');
        });
      }
    });//end validationResult
  }
});

module.exports = router;
