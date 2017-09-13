 var express = require('express');
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
mongoose.connect('mongodb://localhost/Collins_Blog', {useMongoClient:true});
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

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
  resave: true
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
  res.locals.err = req.flash('error');
  next();
});

app.use('/', routes);
app.use('/users', users);

//set Port
var port = process.env.PORT || 3000;

//Port listening
app.listen(port, function(){
  console.log("Listening to port " + port);
});
