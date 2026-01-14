const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan',
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  documents: [
    {
      type: String
    }
  ],
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  reviewedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Verification", VerificationSchema);