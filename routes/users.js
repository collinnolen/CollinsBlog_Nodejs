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
const User = require('../modules/promises/userPromises.js');
const Blog = require('../modules/promises/blogPromises.js');
const Val = require('../middleware/validation.js');

//Mongoose Models
const UnverifiedUser = require('../models/unverifiedUser.js');
const UserModel = require('../models/user.js');

// //Variables


//register router functions
router.get('/register', function(req, res){
  res.render('user/register', {stylesheet: 'user/register'});
});

router.post('/register', Val.newUser, function(req, res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password_2 = req.body.password2;

  Promise.all([User.getUserByEmail(email), User.getUserByUsername(username)])
    .then(function(values){
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
});

router.get('/registerNewUser', function(req, res){
  let unverifiedUser = UnverifiedUser.getUnverifiedUserByUrl(req.query.url, function(err, user){

    let verifiedUser = new UserModel({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      title: user.title,
      password: user.password
    });

    User.createUser(verifiedUser)
      .then(function(user){
        req.flash('success_msg', 'You have successfully verified your account.');
        res.redirect('/users/login');
      })
      .catch(function(err){
        console.log(err);
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
      res.redirect(redirectUrl);
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
  //Checks if a user is logged in, if not sets username to empty string.
  let username = (req.user === undefined) ? '' : req.user.username;

  Promise.all([
    Blog.getUserRecentBlogs(req.params.param1, 5),
    User.getUserByUsername(req.params.param1),
    Blog.getUserFeaturedBlog(req.params.param1),
    User.getUserByUsername(username)
   ])
    .then(function(values){
      res.render('user/profile/userProfile', {
        stylesheet: 'user/profile/userProfile',
        script: 'followingScript',
        blogs: values[0],
        pageUser: values[1],
        featblog: values[2][0],
        //If user is set to 'null' send undefined (no one logged in.)
        user: (values[3] === 'null') ? undefined : values[3]
      });
    })
    .catch(function(err){
      console.log(err);
    });
});

//passport functions
passport.use(new LocalStrategy(
  function(email, password, done) {
    User.getUserByEmail(email)
      .then(function(user){
        if(!user){
          return done(null, false, {message: 'Invalid email/password.'})
        }

        User.comparePassword(password, user.password)
          .then(function(isMatch){
            if(isMatch)
              return done(null, user);
            else
              return done(null, false, {message: 'Invalid email/password.'})
          })
          .catch(function(err){
            console.log(err);
          })
      })//end then
      .catch(function(err){
        console.log(err);
      })//end catch
  }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id).then(function(user){
    done(null, user);
  })
  .catch(function(){
    console.log(err);
  })
});


module.exports = router;
