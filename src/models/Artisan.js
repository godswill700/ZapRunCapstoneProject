const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const artisanSchema = new mongoose.Schema({
  // Log in credentials
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Specific details
  serviceType: {
    type: String,
    enum: ['plumber', 'painter', 'electrician'],
    required: true,
  },
  experienceYears: {
    type: Number,
    required: false,
    default: 0,
  },
  location: {
    type: String,
    required: true,
  },
  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  idCard: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  // Ratings and Reviews
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  // Active Status
  isActive: {
    type: Boolean,
    default: false
  },
  role: { 
    type: String, 
    enum: ['artisan', 'admin'], default: 'artisan' }
  },
{ timestamps: true });

// Hash password before save
artisanSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password (LOGIN)
artisanSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Artisan = mongoose.model('Artisan', artisanSchema);

module.exports = Artisan ;
