const express = require('express');
const { registerArtisan, resendOtp, loginArtisan, verifyArtisanEmail } = require('../controllers/artisan.controller');

const router = express.Router();

// signup route
router.post('/signup', registerArtisan);

// resend otp for route
router.post('resned-otp', resendOtp);

// login route
router.post('/login', loginArtisan);

// Verify email route
router.post('/verify-email', verifyArtisanEmail);

module.exports = router
