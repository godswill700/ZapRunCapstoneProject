const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Artisan = require('../models/Artisan');
const Otp = require('../models/OtpModel');
const sendOtp = require('../utilities/sendOtp');
const { uploadToCloudinary } = require('../middlewares/workSamplesUpload');

// ---------------------- Helpers ----------------------

// Create JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ---------------------- Controllers ----------------------

// Register Artisan
const createArtisan = async (req, res) => {
  const { fullName, phone, email, password, serviceType, location } = req.body;

  try {
    if (!fullName || !phone || !email || !password || !serviceType || !location) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (!validator.isEmail(email)) return res.status(400).json({ message: 'Email is not valid' });
    if (!validator.isStrongPassword(password)) return res.status(400).json({ message: 'Password must include special characters, lowercase, uppercase and be minimum 8 characters' });

    const exists = await Artisan.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const artisan = await Artisan.create({ fullName, phone, email, password, serviceType, location });

    // Send OTP for email verification
    await sendOtp(artisan.email, res);

    res.status(201).json({
      message: 'Artisan registered. Please verify your email.',
      token: createToken(artisan._id),
      artisan: {
        id: artisan._id,
        name: artisan.fullName,
        email: artisan.email,
        serviceType: artisan.serviceType,
        verified: artisan.isEmailVerified || false
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login Artisan
const loginArtisan = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ message: 'Please fill in all fields' });

    const artisan = await Artisan.findOne({ email });
    if (!artisan) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await artisan.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(artisan._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      artisan: {
        id: artisan._id,
        name: artisan.fullName,
        email: artisan.email,
        serviceType: artisan.serviceType,
        verified: artisan.isEmailVerified || false
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Artisan Email
const verifyArtisanEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) return res.status(400).json({ message: 'Please fill in OTP fields' });

    const otpRecord = await Otp.find({ email });
    if (!otpRecord.length) return res.status(400).json({ message: 'No OTP found or already verified' });

    const validOtp = await bcrypt.compare(otp, otpRecord[0].otp);
    if (!validOtp) return res.status(400).json({ message: 'Invalid OTP' });

    await Artisan.updateOne({ email }, { isEmailVerified: true });
    await Otp.deleteMany({ email });

    const artisan = await Artisan.findOne({ email });
    const token = createToken(artisan._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    await Otp.deleteMany({ email });
    await sendOtp(email, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Onboarding (upload work samples)
const onboarding = async (req, res) => {
  const { email, bio, experienceYears } = req.body;

  try {
    if (!email || !bio || !experienceYears) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Upload files to Cloudinary
    const uploadedImages = [];
    for (let file of req.files) {
      const imageUrl = await uploadToCloudinary(file.buffer);
      uploadedImages.push(imageUrl);
    }

    const updatedArtisan = await Artisan.findOneAndUpdate(
      { email },
      { bio, experienceYears, workSamples: uploadedImages },
      { new: true }
    );

    if (!updatedArtisan) return res.status(404).json({ message: 'Artisan not found' });

    res.status(200).json({ success: true, message: 'Onboarding successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get artisan account details by ID
const getAccDetails = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Invalid artisan ID' });

  const artisan = await Artisan.findById(id);
  if (!artisan) return res.status(404).json({ message: 'Artisan not found' });

  res.status(200).json(artisan);
};

// Get all verified artisans (public)
const getArtisans = async (req, res) => {
  try {
    const filter = { isEmailVerified: true };
    if (req.query.serviceType) filter.serviceType = req.query.serviceType;
    if (req.query.city) filter['location.city'] = req.query.city;

    const artisans = await Artisan.find(filter).select('-password');
    res.status(200).json(artisans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch artisans', error: error.message });
  }
};

// Get artisan by ID
const getArtisanById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid artisan ID' });

  const artisan = await Artisan.findById(id).select('-password');
  if (!artisan || !artisan.isEmailVerified) return res.status(404).json({ message: 'Artisan not found' });

  res.status(200).json(artisan);
};

// Admin: get all artisans
const getAllArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.find().select('-password');
    res.status(200).json(artisans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch artisans', error: error.message });
  }
};

// Placeholder: featured/top artisans
const getFeaturedArtisans = async (req, res) => res.json({ message: 'getFeaturedArtisans controller' });
const getTopArtisans = async (req, res) => res.json({ message: 'getTopArtisans controller' });

// ---------------------- Export all ----------------------
module.exports = {
  createArtisan,
  loginArtisan,
  verifyArtisanEmail,
  resendOtp,
  onboarding,
  getAccDetails,
  getArtisans,
  getArtisanById,
  getAllArtisans,
  getFeaturedArtisans,
  getTopArtisans
};
