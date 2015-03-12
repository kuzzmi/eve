nodemailer = require('nodemailer');
Utils = require './utils'
config = Utils.file2json('.everc').google

# create reusable transporter object using SMTP transport
transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.username
        pass: config.password
    }
});

# NB! No need to recreate the transporter object. You can use
# the same transporter object for all e-mails

# setup e-mail data with unicode symbols
mailOptions =
    # from: 'Fred Foo ✔ <foo@blurdybloop.com>', # sender address
    to: 'kuzzmi@gmail.com' # list of receivers
    subject: 'Hello ✔' # Subject line
    text: 'Hello world ✔' # plaintext body
    html: '<b>Hello world ✔</b>' # html body


# send mail with defined transport object
transporter.sendMail mailOptions, (error, info) ->
    if error
        console.log(error.stack);
    else
        console.log('Message sent: ' + info.response);