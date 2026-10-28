const nodemailer = require('nodemailer');
require('dotenv').config(); // Yeh yahan ensure karega ke environment variables properly load hon

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;