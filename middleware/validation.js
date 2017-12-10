const validator = require('validator');

module.exports.newUser = function(req, res, next){

  // firstname
  req.check('firstname', 'First Name is required').notEmpty();
  req.check('firstname', 'Max length for a first name is 50.').isLength({min:1, max:50});
  req.check('firstname', 'Firstname must only contain letters from the alphabet.').isAlpha();
  // lastname
  req.check('lastname', 'First Name is required').notEmpty();
  req.check('lastname', 'Max length for a first name is 50.').isLength({min:1, max:50});
  req.check('lastname', 'Lastname must only contain letters from the alphabet.').isAlpha();
  // username
  req.check('username', 'A username is required').notEmpty();
  req.check('username', 'Usernames must be between 5 and 50 characters.').isLength({min:5, max:50});
  req.check('username', 'Username must only contain letters from the alphabet.').isAlpha();
  // email
  req.check('email', 'First Name is required').notEmpty();
  req.check('email', 'Invalid Email address').isEmail();
  //password
  req.check('password', 'Password is required').notEmpty();
  req.check('password', 'Password must be alpha-numerica and the following symbols: @ # % ^')
    .isWhitelisted('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%^')
  req.check('password', 'Passwords must be 5 to 200 characters long.')
    .isLength({min:8, max:200});
  req.check('password2', 'Passwords do not match').equals(req.body.password);

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      var errors = result.array().map(function (elem) { return elem.msg; });
      res.render('user/register',{
        errors:errors,
        info:{
          firstname : req.body.firstname,
          lastname : req.body.lastname,
          username : req.body.username,
          email : req.body.email
        }
      });
    }
    else{
      return next();
    }
  });
}


module.exports.newBlog = function(req, res, next){
  // body
  req.check('body', 'Body of blog post is required.').notEmpty();
  req.check('body', 'Body of blog post must be 5000 characters or less.').isLength({max: 5000});
  // title
  req.check('title', 'Blog post must have a title.').notEmpty();
  req.check('title', 'Title of blog post must be 100 characters or less.').isLength({max: 100});

  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
          var errors = result.array().map(function (elem) { return elem.msg; });
          res.render('user/dashboard/createblog', { errors: errors });
    }
    else{
      return next();
    }
  });
}
