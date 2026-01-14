const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
    unique: true
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "participantsModel"
    }
  ],
  participantsModel: [
    {
      type: String,
      enum: ["User", "Artisan"],
      required: true
    }
  ],
  messages: [MessageSchema]
});

module.exports = mongoose.model("Chat", ChatSchema);