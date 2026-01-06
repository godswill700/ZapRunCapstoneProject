const express = require('express');
const { registerAdmin, resendOtp, verifyEmail, loginAdmin, getArtisans } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/get-artisans', getArtisans)

// Authentication Routes
// signup route
router.post('/signup', registerAdmin);

// resend otp for route
router.post('/resend-otp', resendOtp);

// login route
router.post('/login', loginAdmin);

// Verify email route
router.post('/verify-email', verifyEmail);

module.exports = router
