const bcrypt = require('bcrypt');
const Otp = require('../models/OtpModel');
const createTransporter = require('../config/nodemailerConfig');

const sendOtp = async (email, res) => {
  try {
    const transporter = await createTransporter();

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Enter <b>${otp}</b> in the website to verify your email address and complete your signup</p>
      <p>The code will <b>expire in 10 minutes</b>.</p>`
    };

    // Hash Otp and save to db
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    await Otp.create({email, otp: hashedOTP});

    // Send Mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Verification OTP sent to ${email}`, data: email });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP email" });
  }  
};

module.exports = sendOtp;