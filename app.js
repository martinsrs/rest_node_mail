var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'martins.rs@gmail.com',
        pass: '5n1tr4m!Q@W'
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
app.sendMail = function(sendRequest) {
	console.log('mandando email');

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'Eduardo Martins <martins.rs@gmail.com>', //sender
	    to: 'martins.rs@gmail.com', // to
	    subject: sendRequest.subject,
	    text: sendRequest.bodyText,
	    html: sendRequest.bodyText // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    } else {
	        console.log('Message sent: ' + info.response);
	        console.log(mailOptions);
	    }
	});
}

/**
  POST URL to send email
*/
app.post('/api/send', function (req, res){
  var sendRequest;
  console.log("POST: ");
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