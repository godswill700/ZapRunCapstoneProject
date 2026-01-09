const Chat = require('../models/chatModel');
const Job = require('../models/Job');

// Create chat when artisan accepst job
const createChatForJob = async (jobId, userId, artisanId) => {
  const existingChat = await Chat.findOne({ jobId });
  if (existingChat) return existingChat;

  const newChat = await Chat.create({ 
    jobId, 
    participants: [userId, artisanId], 
    participantsModel: ["User", "Artisan"], 
    messages: [] 
  });

  return newChat;
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { senderId, senderModel, message } = req.body;

    let chat = await Chat.findOne({ jobId });

    if (!chat) return res.status(404).json({ message: "Chat not found for this job" });

    chat.messages.push({
      sender: senderId,
      message
    });

    await chat.save();

    res.status(200).json({ message: 'Message sent', chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get chat messages for a job
const getChat = async (req, res) => {
  try {
    const { jobId } = req.params;

    const chat  = await Chat.findOne({ jobId }).populate("messages.sender");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createChatForJob,
  sendMessage,
  getChat
};