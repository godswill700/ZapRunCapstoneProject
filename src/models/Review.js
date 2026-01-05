const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true, },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true, },
}, { timestamps: true });

// Prevent duplicate reviews per job
reviewSchema.index({ job: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
