const express = require('express');
require('dotenv').config({path: '.env'})
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphds = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URL, {useMongoClient:true});
const db = mongoose.connection;


//requiring route files
const routes = require('./routes/index');
const users = require('./routes/users');
const blogs = require('./routes/blogs');
const comments = require('./routes/comments');

// // Init Application
 const app = express();

// // View engine
var hbs = exphds.create({
  helpers: {
    time: function(timeToConvert){
      let longDate = new Date(parseInt(timeToConvert, 36));
      let shortDate = longDate.getMonth()+1 + '/' + longDate.getDate() + "/" + longDate.getFullYear();
      return shortDate;
    },
    matchingUsers: function(userA, userB, options){
      if(userA === undefined || userB === undefined)
        return options.inverse();
      else if (userA === userB)
        return options.fn();
      else
        return options.inverse();
    }
  },
  defaultLayout: 'layout'
});
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine); //exphds({defaultLayout:'layout'})
app.set('view engine', 'handlebars');

// //BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// //static files
 app.use(express.static(path.join(__dirname, 'public')));

// // Express Session
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: false
}));

// //Passport Init
app.use(passport.initialize());
app.use(passport.session());

// //Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
  var namespace = param.split('.'),
  root = namespace.shift(),
  formParam = root;

  while(namespace.length){
    formParam += '[' + namesapce.shift() + ']';
  }
  return {
    param: formParam,
    msg : msg,
    value: value
  };
}
}));

// //Connect Flash
app.use(flash());

// globals
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//set routes
app.use('/', routes);
app.use('/users', users);
app.use('/blogs', blogs);
app.use('/comments', comments);

//set Port
var port = process.env.PORT || 3000;

//Port listening
app.listen(port, function(){
  console.log("Listening to port " + port);
});
