var router = require('express').Router();
var Work = require('../models/work');

// Routes To Main Pages
router.get('/',function(req,res){
  res.render('main/home');
});
router.get('/contact',function(req,res){
  res.render('main/contact');
  // res.render('main/showcases');
});

// Route to , and Add work route
router.get('/add-work',function(req,res,next){
  if(req.user){
    res.render('main/add-work',{
      message: req.flash('success')
    });
  } else {
    res.render('main/home.ejs');
  }
});
router.post('/add-work',function(req,res,next){
  var work = new Work();
  work.client = req.body.client;
  work.clientPic = req.body.clientPic;
  work.clientLink = req.body.clientLink;
  work.category = req.body.category;
  work.title = req.body.title;
  work.role = req.body.role;
  work.technologies = req.body.technologies;
  work.shortDesc = req.body.shortDesc;
  work.demoPic = req.body.demoPic;

  work.save(function(err){
    if(err) return next(err);
    req.flash('success','Added Successfully');
    return res.redirect('/add-work');
  });
});

// Route to Works Showcase - public
router.get('/works', function(req,res,next){
  Work.find({}, function(err, works){
    if(err) next(err);
    res.render('main/works',{
      works: works
    });
  });
});

// Route to Specific Category Works Showcase - public
router.get('/works/:cat', function(req,res,next){
  Work.find({ category: req.params.cat}, function(err, catWorks){
    if(err) next(err);
    res.render('main/catWorks',{
      works: catWorks,
      currentCat: req.params.cat
    });
  });
});

// Route to Single Work - public
router.get('/work/:id', function(req,res,next){
  Work.findOne({ _id: req.params.id}, function(err,work){
    if(err) next(err);
    res.render('main/work.ejs',{
      work: work
    });
  });
})

// Route to Manage Works - admin
router.get('/manage-works',function(req,res,next){
  if(!req.user){
    return res.redirect('/');
  } else {
    Work.find({},function(err, works){
      if(err) next(err);
      res.render('main/manage-works',{
        works: works
      });
    });
  }
});

// Route to Edit Single Work
router.get('/work/edit/:id',function(req,res,next){
  Work.findOne({_id: req.params.id}, function(err, work){
    console.log(work);
    if(err) next(err);
    res.render('main/edit-work',{
      work: work,
      message: req.flash('success')
    });
  });
});
router.post('/work/edit/:id',function(req,res,next){
  Work.findOne({_id: req.params.id }, function(err,work){
    if(err) return next(err);
    if(req.body.client) work.client = req.body.client;
    if(req.body.clientPic) work.clientPic = req.body.clientPic;
    if(req.body.clientLink ) work.clientLink = req.body.clientLink;
    if(req.body.category) work.category = req.body.category;
    if(req.body.title) work.title = req.body.title;
    if(req.body.role) work.role = req.body.role;
    if(req.body.technologies) work.technologies = req.body.technologies;
    if(req.body.shortDesc) work.shortDesc = req.body.shortDesc;
    if(req.body.demoPic) work.demoPic = req.body.demoPic;

    work.save(function(err){
      if(err) return next(err);
      req.flash('success','Successfully edited work');
      return res.redirect('/work/edit/'+ req.params.id);
    })
  })
});

// Route to DELETE Single Work
router.delete('/work/delete/:id',function(req,res,next){
  Work.remove({ _id: req.params.id}, function(err){
    if(err) return next(err);
    req.flash('remove','Work deleted');
    res.send(200);
  });
});

module.exports = router;
