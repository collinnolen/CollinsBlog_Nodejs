var express = require('express');
require('dotenv').config({path: '.env'})
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphds = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useMongoClient:true});
var db = mongoose.connection;
const nodemailer = require('nodemailer');


var routes = require('./routes/index');
var users = require('./routes/users');
var blogs = require('./routes/blogs');
var comments = require('./routes/comments');

// // Init Application
 var app = express();
//
// // View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphds({defaultLayout:'layout'}));
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


//nodemailer
