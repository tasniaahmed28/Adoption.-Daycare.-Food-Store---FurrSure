// utils/emailService.js
const nodemailer = require('nodemailer');
const { generateOTP } = require('./otpGenerator');

const sendOTPEmail = async (email) => {
  const otp = generateOTP();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // yourgmail@gmail.com
      pass: process.env.EMAIL_PASS  // app password
    }
  });

  await transporter.sendMail({
    from: `"Fursure 🐾" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Verification Code',
    html: `
      <div style="font-family: Arial;">
        <h2>Welcome to Fursure 🐾</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `
  });

  return otp;
};

module.exports = { sendOTPEmail };
