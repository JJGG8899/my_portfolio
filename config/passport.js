var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// Serialize and deserialize
passport.serializeUser( function(user, done){
  done(null, user._id);
});

passport.deserializeUser( function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

// MiddleWare
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField:'password',
  passReqToCallback: true
}, function(req,email, password, done){
  User.findOne({ email: email}, function(err, user){
    if(err) return done(err);
    if( !user ){
      return done(null, false, req.flash('login_msg', 'No user has been found!'));
    }
    if( !user.comparePassword(password)){
      return done(null, false, req.flash('login_msg','Wrong Password!'));
    }
    return done(null, user);
  });
}));

// customized funtion to tell if user is logged in or not.
exports.isAuthenticated = function(req,res,next){
  if(req.isAuthenticated() ){
    return next();
  }
  res.redirect('/login');
}
