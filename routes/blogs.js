var express = require('express');
var router = express.Router();

//Get home
router.get('/', function(req, res){
  res.render('bloghome');
});


router.get('/:id', function(){
  //todo
});

//post a blog
router.post('/', function(req, res){
  //todo
});

module.exports = router;
