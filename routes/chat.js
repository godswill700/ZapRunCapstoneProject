const express = require('express');
const { createChatForJob, sendMessage, getChat } = require('../controllers/chat.controller');

const router = express.Router();

// send a message
router.post('/send/:jobId', sendMessage);

// get chat for a job
router.get('/:jobId', getChat);

module.exports = router;