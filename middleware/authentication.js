const QueryUtility = require('../modules/queryUtility.js')

module.exports.ensureAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      req.flash('error_msg', 'You are not logged in');
      // /dashboard/
      //console.log(redirectQueryBuilder(req.url));
      //console.log(redirectQueryBuilder('/dashboard/newblog?page=0&p=2'));
      res.redirect('/users/login'+ QueryUtility.redirectEncodeQueryBuilder(req.url));
    }
}
