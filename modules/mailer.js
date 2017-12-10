const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const xoauth2 = require('xoauth2');

var mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASS
  }
});

//sends email to specified email contianing link to verify an account.
module.exports.sendVerifingEmail = function(user, callback){
  var url = process.env.SITE_URL + '/users/registerNewUser?url=' + user.url;

  var mailOptions = {
    from: 'Collins Blog <no-reply.collins.blog.site@gmail.com>',
    to: user.email,
    subject: 'Verifying Email for Collins Blog',
    text: 'Please follow this link to verify your account : \n' + url,
    html: 'Please follow this link to verify your account : \n' + '<a href="' + url + '">'+ url +'</a>'
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
