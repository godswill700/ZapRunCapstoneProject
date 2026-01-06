const express = require('express');
const { registerAdmin, resendOtp, verifyEmail, loginAdmin } = require('../controllers/admin.controller');

const router = express.Router();

// signup route
router.post('/signup', registerAdmin);

// resend otp for route
router.post('/resend-otp', resendOtp);

// login route
router.post('/login', loginAdmin);

// Verify email route
router.post('/verify-email', verifyEmail);

module.exports = router
