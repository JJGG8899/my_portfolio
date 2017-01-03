var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');

// router.get('/signup',function(req,res,next){
//   if(req.user){
//     res.render('user/signup',{
//       error_msg: req.flash('error_msg')
//     });
//   } else {
//     ren.render('main/home');
//   }
// });
router.post('/signup',function(req,res,next){
  var user = new User();
  user.password = req.body.password;
  user.email = req.body.email;
  // add a few validation
  User.findOne({email: req.body.email}, function(err,existingUser){
    if(existingUser){
      // console.log(req.body.email + ' is already used');
      req.flash('error_msg','Account already exists');
      return res.redirect('/signup');
    } else {
      user.save(function(err,user){
        if(err) return next(err);
        return res.redirect('/');
      });
    }
  });
});

router.get('/login', function(req,res){
  if(req.user) return res.redirect('/');
  res.render('user/login',{ message: req.flash('login_msg')});
});
router.post('/login', passport.authenticate('local-login',{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/profile', function(req,res,next){
  User.findOne({_id: req.user._id}, function(err, user){
    if(err) return next(err);
    res.render('user/profile', { user: user });
  });
});

router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/');
});

module.exports = router;
