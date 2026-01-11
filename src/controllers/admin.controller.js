const Admin = require("../models/Admin");
const Artisan = require("../models/Artisan");
const Otp = require("../models/OtpModel");
const sendOtp = require("../utilities/sendOtp");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

// Create JWT token
const createToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// ================= REGISTER ADMIN =================
const registerAdmin = async (req, res) => {
  const { fullname, phone, email, password } = req.body;

  try {
    if (!fullname || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number & symbol",
      });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const admin = await Admin.create({
      fullname,
      phone,
      email,
      password,
    });

    await sendOtp(admin.email, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY ADMIN EMAIL =================
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP expired or email already verified",
      });
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Admin.updateOne({ email }, { isVerified: true });
    await Otp.deleteMany({ email });

    const admin = await Admin.findOne({ email });

    const token = createToken(admin._id, admin.role);

    res.status(200).json({
      success: true,
      email: admin.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN ADMIN =================
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.isVerified) {
      return res.status(403).json({ message: "Please verify your email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(admin._id, admin.role);

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.fullname,
        email: admin.email,
        role: admin.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN DASHBOARD =================
const getDashboard = async (req, res) => {
  res.status(200).json({
    message: "Welcome to Admin Dashboard",
    admin: req.admin,
  });
};

// ================= GET ALL ARTISANS =================
const getArtisans = async (req, res) => {
  const artisans = await Artisan.find({}).sort({ fullname: 1 });
  res.status(200).json(artisans);
};

// ================= RESEND OTP =================
const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  await Otp.deleteMany({ email });
  await sendOtp(email, res);
};

// EXPORTS
module.exports = {
  registerAdmin,
  verifyEmail,
  loginAdmin,
  resendOtp,
  getDashboard,
  getArtisans,
};
