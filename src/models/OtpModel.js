const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
    createdAt: { 
      type: Date, 
      default: Date.now, 
      expires: 300 }, // auto expire 5 mins
});

// Check if model already exists, else define it
module.exports = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
