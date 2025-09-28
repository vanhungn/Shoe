const nodemailer = require("nodemailer");
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true nếu dùng 465
  auth: {
  user: "9808c3002@smtp-brevo.com",
  pass: "NInFUqYMZW2vEGBy"
  },
});
module.exports = transporter