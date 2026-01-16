const nodemailer = require("nodemailer");

const AUTH_EMAIL = process.env.AUTH_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: AUTH_EMAIL,
        pass: EMAIL_PASS
      },
      connectionTimeout: 10000, // 10 seconds
      socketTimeout: 10000
    });

    // IMPORTANT: verify connection
    await transporter.verify();

    console.log("Email transporter ready ✅");
    return transporter;
  } catch (error) {
    console.error("Transporter error:", error.message);
    throw new Error("Email service unavailable");
  }
};

module.exports = createTransporter;
