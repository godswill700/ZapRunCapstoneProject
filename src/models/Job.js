const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedArtisan: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
