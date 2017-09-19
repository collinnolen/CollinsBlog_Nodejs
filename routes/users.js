var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
const randomstring = require('randomstring');

var User = require('../models/user.js');
var UnverifiedUser = require('../models/unverifiedUser.js')
var MailingService = require('../services/mailingService.js');


//promises
let getUserByEmail = function(email){
  return new Promise(function(resolve, reject){
    User.getUserByEmail(email, function(err, user){
      if(err)
        reject();
      else{
        if(user == null){
          //console.log('null email');
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
        reject();
      else{
        if(user == null)
          resolve('null');
        else
          resolve(user);
      }
    });
  });
}

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

  var errors = req.validationErrors();

  if(errors){
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
            else MailingService.sendVerifingEmail(user);
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
  res.render('user/login');
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res){
    res.redirect('/');
  });


//logout fucntions
router.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out.')
  res.redirect('/users/login');
});


//Dashboard router functions
router.get('/dashboard', ensureAuthenticated, function(req, res){
  res.render('user/dashboard/dashboard');
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


//passport functions
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


module.exports = router;
