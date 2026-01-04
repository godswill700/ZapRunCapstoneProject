const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator')
const Artisan = require('../models/artisanModel');
const sendOtp = require('../utils/sendOtp');

// Create token
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '7d' })
}

// Register Artisan
const registerArtisan = async (req, res) => {
  const { fullName, phone, email, password, serviceType, location } = req.body;

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

  try {
    const artisan = await Artisan.create({fullName, phone, email, password, serviceType, location});
    
    sendOtp(artisan.email, res);
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

const loginArtisan = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({message: "Please fill in all fields!!!"});

  const artisan = Artisan.findOne({ email });

  if (!artisan) return res.status(400).json({message: "Incorrect email"});

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({message: "Incorrect password"});

  try {
    // create token
    const token = createToken(user._id);
    res.status(200).json({email, token})
  } catch (error) { 
    res.status(400).json({error: error.message})
  }
};

module.exports = {
  registerArtisan,
  loginArtisan
};