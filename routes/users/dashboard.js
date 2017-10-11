const express = require('express');
const router = express.Router();

//Custom Modules
const QueryUtility = require('../../modules/queryUtility.js');
const Auth = require('../../middleware/authentication.js');
const FileUtility = require('../../modules/fileUtility.js');
const Blog = require('../../modules/promises/blogPromises.js');
const User = require('../../modules/promises/userPromises.js');

//Dashboard router functions
router.get('/', Auth.ensureAuthenticated, function(req, res){
  Promise.all([
      Blog.getUserRecentBlogs(req.user.username, 5),
      Blog.getUserFollowingRecentBlogs(req.user.following, 5, 0)
    ])
  .then(function(values){
    res.render('user/dashboard/dashboard',
     {stylesheet: 'user/dashboard/dashboard',
      recentblogs: values[0],
      followingBlogs: values[1]});
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
    Blog.getUserBlogsByPage(req.user.username, page),
    Blog.getUserBlogCount(req.user.username)
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

router.get('/following', Auth.ensureAuthenticated, function(req, res){
  User.getUserByUsername(req.user.username)
    .then((user) =>{
      res.render('user/dashboard/following',{
        script: 'followingScript',
        stylesheet: 'user/dashboard/following',
        following: user.following
      });
    })
    .catch((error) =>{
      console.log(error);
    })
})

module.exports = router;
