const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASS,
    xoauth2: xoauth2.createXOAuth2Generator({
      user: process.env.EMAIL_ACCOUNT,
      clientID: process.env.GOOGLE_OAUTH_CLIENT,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      refreshToken: process.env.GOOGLE_OAUTH_REFRESHTOKEN
    })
  }
});


function queryStringBuilder(user){
  return process.env.SITE_URL + '/registerNewUser?'
}


module.exports.sendVerifingEmail = function(user, callback){
  var url = process.env.SITE_URL + '/users/registerNewUser?url=' + user.url;

  var mailOptions = {
    from: 'Collins Blog <no-reply.collins.blog.site@gmail.com>',
    to: user.email,
    subject: 'Verifying Email for Collins Blog',
    text: 'Please follow this link to verify your account : ' + url,
    html: 'Please follow this link to verify your account: </br>' + url
  }

  mailer.sendMail(mailOptions, function(err, res){
    if(err){
      console.log(err);
    }
    else{
      console.log('Email Sent');
    }
  });
}// end sendVerifingEmail
