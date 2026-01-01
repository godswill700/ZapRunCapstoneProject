const mongoose = require('mongoose');
const validator = require('validator')
const Artisan = require('../models/artisanModel');

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
    await Artisan.create({fullName, phone, email, password, serviceType, location});
    res.status(200).json({"message": "Account created successfully!"})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  registerArtisan
};