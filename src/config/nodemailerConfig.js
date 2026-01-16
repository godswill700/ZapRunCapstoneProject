// const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const AUTH_EMAIL = process.env.AUTH_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: AUTH_EMAIL,
        pass: EMAIL_PASS
      },
    });

    return transporter;
  } catch (error) {
    console.error("Error creating transporter:", error.message);
    throw new Error("Failed to create mail transporter");
  }
};

module.exports = createTransporter;
