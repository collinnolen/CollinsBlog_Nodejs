const express = require('express');
const router = express.Router();

//Custom Modules
const QueryUtility = require('../../modules/queryUtility.js');
const Auth = require('../../middleware/authentication.js');
const FileUtility = require('../../modules/fileUtility.js');
const PromiseUtil = require('../../modules/promises.js');

//Mongoose Models
const User = require('../../models/user.js');
const Blog = require('../../models/blog.js');

//Dashboard router functions
router.get('/', Auth.ensureAuthenticated, function(req, res){
  Promise.all([
      PromiseUtil.getUserRecentBlogs(req.user.username, 5),
      PromiseUtil.getUserFeaturedBlog(req.user.username)
    ])
  .then(function(values){
    res.render('user/dashboard/dashboard',
     {stylesheet: 'user/dashboard/dashboard',
      recentblogs: values[0],
      featuredblog: values[1][0]});
  })
  .catch(function(err){
    res.send('Failed');
    console.log(err.message);
  });
});

router.get('/newblog', Auth.ensureAuthenticated, function(req, res){
  res.render('user/dashboard/createBlog',
   {stylesheet: 'user/dashboard/createBlog'});
});

router.get('/myblogs', Auth.ensureAuthenticated, function(req, res){
  var page;
  if(!req.query.page || req.query.page < 1)
    page = 1;
  else
    page = req.query.page;

  Promise.all([
    PromiseUtil.getUserBlogsByPage(req.user.username, page),
    PromiseUtil.getUserBlogCount(req.user.username)
   ])
    .then(function(values){
      let count = Math.ceil(values[1] / 10);
      res.render('user/dashboard/myblogs',{
         stylesheet: 'user/dashboard/myblogs',
         blogCount: FileUtility.pageNumberJsonBuilder(count),
         blogs: values[0]
       });
    })
    .catch(function(errors){
      console.log(errors);
    });
});

module.exports = router;
