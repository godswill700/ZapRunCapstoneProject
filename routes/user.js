const express = require('express');
const { registerUser, resendOtp, verifyEmail, loginUser } = require('../controllers/user.controller');

const router = express.Router();

// Authentication Routes
// signup route
router.post('/signup', registerUser);

// resend otp for route
router.post('/resend-otp', resendOtp);

// login route
router.post('/login', loginUser);

// Verify email route
router.post('/verify-email', verifyEmail);

module.exports = router
