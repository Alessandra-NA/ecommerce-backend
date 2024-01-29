const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
   host: process.env.MAIL_HOST,
   port: process.env.MAIL_PORT,
   secure: true,
   auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
   }
})

transporter.verify((err, success) => {
   if (err) {
      console.log(err);
   } else {
      console.log('Server is ready to take messages');
   }
})

module.exports = { transporter }