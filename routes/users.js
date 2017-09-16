var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');

var User = require('../models/user.js')

//register
router.get('/register', function(req, res){
  res.render('register');
});

//register
router.post('/register', function(req, res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var password_2 = req.body.password2;

  req.checkBody('firstname', 'First Name is required').notEmpty();
  req.checkBody('lastname', 'First Name is required').notEmpty();
  req.checkBody('email', 'First Name is required').notEmpty();
  req.checkBody('email', 'Invalid Email address').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });
  }
  else{
    var newUser = new User({
      first_name: firstname,
      last_name: lastname,
      email: email,
      title: 'Member',
      password: password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You have successfully registered.');
    res.redirect('/users/login');
  }
});


//Login
router.get('/login', function(req, res){
  res.render('login');
});


passport.use(new LocalStrategy(
  function(email, password, done) {
    User.getUserByEmail(email, function(err, user){
      if(err) console.log(err); //todo
      if(!user){
        return done(null, false, {message: 'Invalid email.'})
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) console.log(err); //todo
        if(isMatch){
          return done(null, user);
        }
        else{
          return done(null, false, {message: 'Invalid password.'})
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


router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res){
    res.redirect('/');
  });

//logout
router.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out.')
  res.redirect('/users/login');
});


router.get('/dashboard', ensureAuthenticated, function(req, res){
  res.render('dashboard');
})

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      req.flash('error_msg', 'You are not logged in');
      res.redirect('/users/login');
    }
}


module.exports = router;
