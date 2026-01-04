const express = require('express');
const { registerArtisan, loginArtisan, verifyArtisanEmail } = require('../controllers/artisan.controller')

const router = express.Router();

// signup route
router.post('/signup', registerArtisan);

// login route
router.post('/login', loginArtisan);

// Verify email route
router.post('/verify-email', verifyArtisanEmail);

module.exports = router
