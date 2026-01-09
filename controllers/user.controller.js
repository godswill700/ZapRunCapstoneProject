const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const sendOtp = require('../utils/sendOtp');

// Create token
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '2d' })
};

// Register User
const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) return res.status(400).json({message: 'All fields must be filled'});
    
    if (!validator.isEmail(email)) return res.status(400).json({message: 'Email is not valid'});

    if (!validator.isStrongPassword(password)) return res.status(400).json({message: 'Password must include special characters, lowercase, uppercase and be minimum 8 characters'});

    const exists = await User.findOne({ email });
    if (exists) res.status(400).json({message: 'Email already in use'});
  
    const user = await User.create({fullname, email, password});
    
    sendOtp(user.email, res);
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

// Verify User
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) return res.status(400).json({message: "Please fill in OTP fields!!!"});
  
    const otpRecord = await Otp.find({ email });
    if (otpRecord.length <= 0) return res.status(400).json({message: "User record does not exist or has been verified already. Please sign up or log in."});
  
    const hashedOtp = otpRecord[0].otp;
  
    const validOtp = await bcrypt.compare(otp, hashedOtp);
    if (!validOtp) return res.status(400).json({message: "Invalid otp, confirm the code in your inbox"});
  
    // Mark enail as verified
    await User.updateOne({ email }, { isVerified: true });
  
    // Delete otp Record
    await Otp.deleteMany({ email });

    const user = await User.findOne({ email });

    // create token
    const token = createToken(user._id);
    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({message: "Please fill in all fields!!!"});

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({message: "Incorrect email"});

    // create token
    const token = createToken(user._id);
    res.status(200).json({email, token})
  } catch (error) { 
    res.status(400).json({error: error.message})
  }
};