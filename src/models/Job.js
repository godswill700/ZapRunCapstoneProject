const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    service: {
      type: String,
      enum: ["plumber", "painter", "electrician"],
      required: true,
    },

    assignedArtisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artisan",
      default: null,
    },

    location: {
      city: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
