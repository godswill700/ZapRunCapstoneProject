const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator')
const Artisan = require('../models/artisanModel');
const Otp = require('../models/otpModel');
const sendOtp = require('../utils/sendOtp');

// Create token
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '2d' })
}

// Register Artisan
const registerArtisan = async (req, res) => {
  const { fullName, phone, email, password, serviceType, location } = req.body;

  try {
    if (!fullName || !phone || !email || !password || !serviceType || !location) {
      return res.status(400).json({message: 'All fields must be filled'});
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({message: 'Email is not valid'});
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({message: 'Password must include special characters, lowercase, uppercase and be minimum 8 characters'});
    }

    const exists = await Artisan.findOne({ email });
    if (exists) res.status(400).json({message: 'Email already in use'});
  
    const artisan = await Artisan.create({fullName, phone, email, password, serviceType, location});
    
    sendOtp(artisan.email, res);
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

// Resend Otp for email verification
const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is missing" });

  try {
    // delete any otp record before resending otp
    await Otp.deleteMany({ email });

    await sendOtp(email, res);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// Verify Artisan's Email
const verifyArtisanEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) return res.status(400).json({message: "Please fill in OTP fields!!!"});
  
    const otpRecord = await Otp.find({ email });
    if (otpRecord.length <= 0) return res.status(400).json({message: "Artisan record does not exist or has been verified already. Please sign up or log in."});
  
    const hashedOtp = otpRecord[0].otp;
  
    const validOtp = await bcrypt.compare(otp, hashedOtp);
    if (!validOtp) return res.status(400).json({message: "Invalid otp, confirm the code in your inbox"});
  
    // Mark enail as verified
    await Artisan.updateOne({ email }, { isEmailVerified: true });
  
    // Delete otp Record
    await Otp.deleteMany({ email });

    const artisan = await Artisan.findOne({ email });

    // create token
    const token = createToken(artisan._id);
    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

// Login Artisan
const loginArtisan = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({message: "Please fill in all fields!!!"});

    const artisan = await Artisan.findOne({ email });

    if (!artisan) return res.status(400).json({message: "Incorrect email"});

    const match = await bcrypt.compare(password, artisan.password);

    if (!match) return res.status(400).json({message: "Incorrect password"});

    // create token
    const token = createToken(artisan._id);
    res.status(200).json({email, token})
  } catch (error) { 
    res.status(400).json({error: error.message})
  }
};

module.exports = {
  registerArtisan,
  resendOtp,
  verifyArtisanEmail,
  loginArtisan,
};