const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const randomstring = require('randomstring');

//Custom Modules
const QueryUtility = require('../modules/queryUtility.js');
const Auth = require('../middleware/authentication.js');
const Mailer = require('../modules/mailer.js');
const FileUtility = require('../modules/fileUtility.js');

//Mongoose Models
const User = require('../models/user.js');
const Blog = require('../models/blog.js');
const UnverifiedUser = require('../models/unverifiedUser.js');

//Variables
const myBlogs_NumberOfBlogsToDisplay = 10;

//register router functions
router.get('/register', function(req, res){
  res.render('user/register');
});

router.post('/register', function(req, res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password_2 = req.body.password2;

  req.checkBody('firstname', 'First Name is required').notEmpty();
  req.checkBody('lastname', 'First Name is required').notEmpty();
  req.checkBody('username', 'A username is required').notEmpty();
  req.checkBody('email', 'First Name is required').notEmpty();
  req.checkBody('email', 'Invalid Email address').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      var errors = result.array().map(function (elem) { return elem.msg; });
      res.render('user/register',{
        errors:errors
      });
    }
    else{
      Promise.all([getUserByEmail(email), getUserByUsername(username)])
        .then(function(values){
          console.log(values);
          if(values[0] === 'null' && values[1] === 'null'){
            var newUnverifiedUser = new UnverifiedUser({
              first_name: firstname,
              last_name: lastname,
              username: username,
              email: email,
              title: 'member',
              password: password,
              url: randomstring.generate(64)
            });

            UnverifiedUser.createUnverifiedUser(newUnverifiedUser, function(err, user){
              if(err) throw err;
              else Mailer.sendVerifingEmail(user);
            });

            req.flash('success_msg', 'You have successfully registered, please go to your email account and click the link to verify your account.');
            res.redirect('/users/login');
          }
          else if(values[0] === 'null'){
            req.flash('error_msg', 'The username you wish to use is already in use. Please use a different username.');
            res.redirect('/users/register');
          }
          else{
            req.flash('error_msg', 'The email you wish to use is already in use. Please use a different email address.');
            res.redirect('/users/register');

          }
        })
        .catch(function(err){
          console.log(err);
        });
    }
  });
});

router.get('/registerNewUser', function(req, res){
  var unverifiedUser = UnverifiedUser.getUnverifiedUserByUrl(req.query.url, function(err, user){

    var verifiedUser = new User({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      title: user.title,
      password: user.password
    });

    User.createUser(verifiedUser, function(err, user){
      if(err) throw err;
      else{
        req.flash('success_msg', 'You have successfully verified your account.');
        res.redirect('/users/login');
      }
    });

    UnverifiedUser.removeUnverifiedUserByUrl(req.query.url, function(){
        if(err) console.log(err);
    });

  });
});


//Login router functions
router.get('/login', function(req, res){
  if(req.query.redirect === undefined)
    res.render('user/login', {stylesheet: 'user/login'});
  else
    res.render('user/login',{ stylesheet: 'user/login',query : '?redirect='+req.query.redirect});
});

router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: true}),
  function(req, res){
    if(req.query.redirect === undefined){
      res.redirect('/');
    }
    else {
      var redirectUrl = QueryUtility.redirectDecodeQueryBuilder(req.query.redirect);
      res.redirect('/users' + redirectUrl);
    }
  });


//logout fucntions
router.get('/logout', Auth.ensureAuthenticated, function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out.')
  res.redirect('/users/login');
});


//User page routes
router.get('/profile/:param1', function(req, res){
  var page;
  
  if(req.query.page === undefined)
    page = 1;
  else
    page = req.query.page;

  Promise.all([
    getUserBlogsByPage(req.params.param1, page),
    getUserByUsername(req.params.param1)
   ])
    .then(function(values){
      res.render('user/profile/userProfile', {
        stylesheet: 'user/profile/userProfile',
        User: values[1],
        Blogs: values[0]
      });
    })
    .catch(function(err){
      console.log(err);
    });
});


//Dashboard router functions
router.get('/dashboard', Auth.ensureAuthenticated, function(req, res){
  Promise.all([
      getUserRecentBlogs(req.user.username, 5),
      getUserFeaturedBlog(req.user.username)
    ])
  .then(function(values){
    res.render('user/dashboard/dashboard',
     {stylesheet: 'user/dashboard/dashboard',
      recentblogs: values[0],
      featuredblog: values[1][0]});
  })
  .catch(function(err){
    res.send('Failed');
    console.log(err.message);
  });
});

router.get('/dashboard/newblog', Auth.ensureAuthenticated, function(req, res){
  res.render('user/dashboard/createBlog',
   {stylesheet: 'user/dashboard/createBlog'});
});

router.get('/dashboard/myblogs', Auth.ensureAuthenticated, function(req, res){
  var page;
  if(!req.query.page || req.query.page < 1)
    page = 1;
  else
    page = req.query.page;

  Promise.all([
    getUserBlogsByPage(req.user.username, page),
    getUserBlogCount(req.user.username)
   ])
    .then(function(values){
      let count = Math.ceil(values[1] / 10);
      res.render('user/dashboard/myblogs',{
         stylesheet: 'user/dashboard/myblogs',
         blogCount: FileUtility.pageNumberJsonBuilder(count),
         blogs: values[0]
       });
    })
    .catch(function(errors){
      console.log(errors);
    });
});

//promises
let getUserByEmail = function(email){
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

let getUserByUsername = function(username){
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

let getUserBlogsByPage = function(username, pageNumber){
  return new Promise(function(resolve, reject){
    Blog.getUserBlogsByPage(username, myBlogs_NumberOfBlogsToDisplay, pageNumber, function(err, blogs){
      if(err) reject(err);
      else resolve(blogs);
    });
  });
}

let getUserBlogCount = function(username){
  return new Promise(function(resolve, reject){
    Blog.getUserBlogCountByUsername(username, function(err, blogCount){
      if(err) reject(err);
      else resolve(blogCount);
    });
  });
}

let getUserRecentBlogs = function(username, blogsToReturn){
  return new Promise(function(resolve, reject){
    Blog.getUserRecentBlogs(username, blogsToReturn, function(err, blogs){
      if(err) reject(err);
      else resolve(blogs);
    });
  });
}

let getUserFeaturedBlog = function(username){
  return new Promise(function(resolve, reject){
    Blog.getUsersFeaturedBlog(username, function(err, blog){
      if(err) reject(err);
      else resolve(blog);
    });
  });
}

//passport functions
passport.use(new LocalStrategy(
  function(email, password, done) {
    User.getUserByEmail(email, function(err, user){
      if(err) console.log(err); //todo
      if(!user){
        return done(null, false, {message: 'Invalid email/password.'})
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) console.log(err); //todo
        if(isMatch){
          return done(null, user);
        }
        else{
          return done(null, false, {message: 'Invalid email/password.'})
        }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


module.exports = router;
