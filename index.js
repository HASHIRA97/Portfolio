const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const port = 4000;
const cors = require("cors");

require("dotenv").config();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get("/", cors(), async (req, res) => {
    res.send("This is working");
});

app.post("/post_name", async(req, res) => {
    let name = req.body;
    console.log(name);

    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>First Name: ${req.body.fName}</li>
      <li>Last Name: ${req.body.lName}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>`;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS  // generated ethereal password
        },
        tls:{
        rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.MAIL_FROM, // sender address
        to: 'owen.ibrahim97@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        msg = "Message sent";
        res.render("main", {msg: msg});
    });
});
/************************************************************* */
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'my-app/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'my-app/build', 'index.html'));
  });
}
/****************************************************************** */
const whitelist = ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:8080', 'https://intense-castle-15347.herokuapp.com']
const corsOptions = {
    origin: function (origin, callback) {
      console.log("** Origin of request " + origin)
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        console.log("Origin acceptable")
        callback(null, true)
      } else {
        console.log("Origin rejected")
        callback(new Error('Not allowed by CORS'))
      }
    }
}
/*********************************************************************** */
app.use(cors(corsOptions))
/*********************************************************************** */

app.listen(process.env.PORT || port, () => {
    console.log(`Listening at http://localhost:${port}`);
});