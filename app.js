var path           = require('path')
  , templatesDir   = path.join(__dirname, 'templates')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'martins.rs@gmail.com',
        pass: ''
    }
});

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express'),

app = express();
app.use(bodyParser());
app.use(cookieParser());

app.get('/', function(req, res){
	res.send('Node Api is working');
});

// send email method
app.sendMail = function(request) {
	console.log('sending email');

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'Eduardo Martins <martins.rs@gmail.com>', //sender
	    to: 'martins.rs@gmail.com', // to
	    subject: request.subject,
	    text: request.bodyText,
	    html: request.bodyText // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function (error, info){
	    if(error){
	        console.log(error);
	    } else {
	        console.log('Message sent: ' + info.response);
	        console.log(mailOptions);
	    }
	});
}

app.sendWithTemplate = function(request) {
	console.log('sending with Template');

	emailTemplates(templatesDir, function (err, template) {
	  if (err) {
	    console.log(err);
	  } else {

	    // An example users object with formatted email function
	    var locals = {
	      email: 'martins.rs@gmail.com',
	      name: {
	        first: request.firstname,
	        last: request.lastname
	      }
	    };

	    // Send a single email
	    template('request', locals, function(err, html, text) {
	    	
	      if (err) {
	        console.log(err);
	      } else {
	        transporter.sendMail({
	          from: 'martins.rs@gmail.com',
	          to: locals.email,
	          subject: 'Email sent using templates',
	          html: html,
	          // generateTextFromHTML: true,
	          text: text
	        });
	      }
	    });

	  }
	});	
}

/**
  POST URL to send email with templates
*/
app.post('/api/sendWithTemplate', function (req, res){
  var sendRequest;
  console.log("sendWithTemplate - POST: ");
  console.log(req.body);

  sendRequest = {
    firstname : req.body.firstname,
    lastname: req.body.lastname
  };

  app.sendWithTemplate(sendRequest);

  return res.send(sendRequest);
});

/**
  POST URL to send email
*/
app.post('/api/send', function (req, res){
  var sendRequest;
  console.log("send - POST: ");
  console.log(req.body);

  sendRequest = {
    subject : req.body.subject,
    bodyText: req.body.bodyText
  };

  app.sendMail(sendRequest);

  return res.send(sendRequest);
});


var server = app.listen(3000);
console.log('Servidor Express iniciado na porta %s', server.address().port);
