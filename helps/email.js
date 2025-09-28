const nodemailer = require('nodemailer');
require('dotenv').config()
const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});
module.exports = transporter