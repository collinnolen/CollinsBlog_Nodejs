const QueryUtility = require('../modules/queryUtility.js')

module.exports.ensureAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      req.flash('error_msg', 'You are not logged in');
      res.redirect('/users/login'+ QueryUtility.redirectEncodeQueryBuilder(req.originalUrl));
    }
}
