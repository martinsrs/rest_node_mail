var path           = require('path')
  , templatesDir   = path.join(__dirname, 'templates')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');

emailTemplates(templatesDir, function(err, template) {

  if (err) {
    console.log(err);
  } else {

    // ## Send a single email

    // Prepare nodemailer transport object
    var transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'martins.rs@gmail.com',
            pass: ''
        }
    });

    // An example users object with formatted email function
    var locals = {
      email: 'martins.rs@gmail.com',
      name: {
        first: 'Mamma',
        last: 'Mia'
      }
    };

    // Send a single email
    template('request', locals, function(err, html, text) {
      if (err) {
        console.log(err);
      } else {
        transport.sendMail({
          from: 'martins.rs@gmail.com',
          to: locals.email,
          subject: 'Mangia gli spaghetti con polpette!',
          html: html,
          // generateTextFromHTML: true,
          text: text
        }, function(err, responseStatus) {
          if (err) {
            console.log(err);
          } else {
            console.log(responseStatus.message);
          }
        });
      }
    });

  }
});