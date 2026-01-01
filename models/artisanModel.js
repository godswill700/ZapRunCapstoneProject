const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ArtisanSchema = new mongoose.Schema({
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
  bio: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  workSamples: {
    type: [String],
    default: [],
  },
  // Verification
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
  }
}, { timestamps: true });

ArtisanSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Artisan', ArtisanSchema);