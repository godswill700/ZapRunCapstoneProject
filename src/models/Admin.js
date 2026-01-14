// models/Admin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define Admin schema
const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Encrypt password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check entered password with hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
