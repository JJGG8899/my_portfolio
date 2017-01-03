var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('passport');

// Load self set secret config file
var secret = require('./config/secret');

// Load Models
var User = require('./models/user');

// Configure App
var app = express();

// Connect mongoose
mongoose.connect(secret.database,
  function(err){
    if(err){
      console.log(err);
    } else {
      console.log('connected to DB');
    }
  });

// MiddleWare
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs', engine);
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialzed: true,
  secret: secret.secretKey,
  store: new MongoStore({url: secret.database, autoReconnect:true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global Vars
app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});

// Routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);

// User Routes - This router is only to test postAPI on mongolab by postMan
// app.post('/create-user',function(req,res,next){
//   var user = new User();
//   user.email = req.body.email;
//   user.password = req.body.password;
//
//   console.log(user);
//
//   user.save(function(err){
//     if(err) return next(err);
//     console.log('Cathy651');
//     res.json('Successfully Created User');
//   });
// });

// Listen
app.listen(secret.port, function(err){
  if(err) throw err;
  console.log('Server is running on port ' + secret.port);
});
