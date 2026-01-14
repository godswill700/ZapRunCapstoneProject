const Verification = require('../models/Verifications');
const Artisan = require('../models/Artisan');
const { uploadToCloudinary } = require('../middlewares/workSamplesUpload');

// Artisan submits verification
const submitVerification = async (req, res) => {
  try {
    const { location } = req.body;
    const artisanId = req.params.artisanId;

    const exists = await Verification.findOne({ artisan: artisanId });
    if (exists) return res.status(400).json({ message: "Verification already submitted" });

    // Upload files to Cloudinary
    const uploadedImages = [];
    for (let file of req.files) {
      const imageUrl = await uploadToCloudinary(file.buffer);
      uploadedImages.push(imageUrl);
    }

    const verification = await Verification.create({
      artisan: artisanId,
      location,
      documents: uploadedImages
    });

    res.status(201).json({ message: "Verification submitted successfully", verification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit verification" });
  }
};

// Get all pending verifications
const getPendingVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find({ status: "pending" }).populate("artisan");

    res.json(verifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending verifications" });
  }
};

// Get all completed verifications
const getCompletedVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find({ status: { $in: ["verified", "rejected"] } }).populate("artisan");

    res.json(verifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch completed verifications" });
  }
};

// Approve or reject verifications
const reviewVerification = async (req, res) => {
  try {
    const verificationId = req.params.verificationId;
    const { status } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const verification = await Verification.findById(verificationId);
    if (!verification) return res.status(404).json({ message: "Verification not found" });

    verification.status = status;
    verification.reviewedAt = new Date();
    await verification.save();

    // Update artisan verification status
    await Artisan.findByIdAndUpdate(verification.artisan, {
      isVerified: status === "verified",
      verificationStatus: status
    });

    res.json({ message: `Verification ${status}`, verification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to review verification" });
  }
};

module.exports = {
  reviewVerification,
  getCompletedVerifications,
  getPendingVerifications,
  submitVerification
}