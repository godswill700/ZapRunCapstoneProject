const express = require('express');
const { registerArtisan, resendOtp, loginArtisan, verifyArtisanEmail, onboarding, getAccDetails } = require('../controllers/artisan.controller');
const { upload } = require('../middleware/workSamplesUpload')

const router = express.Router();

router.get('/:id', getAccDetails);

// signup route
router.post('/signup', registerArtisan);

// resend otp for route
router.post('/resend-otp', resendOtp);

// login route
router.post('/login', loginArtisan);

// Verify email route
router.post('/verify-email', verifyArtisanEmail);

// Onboarding route
router.post('/onboard', upload.array("images", 10), onboarding)

module.exports = router
