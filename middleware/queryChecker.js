module.exports.commentAndPostId = function(req, res, next){
  if(req.query.post_id === undefined){
    req.flash('error_msg', 'Post Id is needed to fetch comment with id: ' + req.params.id + '.');
    res.redirect('back');
  }
  else{
    if(req.query.json === undefined){
      res.send('If you\'r looking for json, try adding ?json=true');
    }
    else{
      if(req.query.json === 'true'){
        return next();
      }
    }
  }
}

module.exports.postId = function(req, res, next){
  if(req.query.post_id === undefined){
    req.flash('error_msg', 'Post id is needed.');
  }
  else{
    return next();
  }
}
