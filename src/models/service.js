const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);