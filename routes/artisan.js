const express = require('express');
const { registerArtisan, loginArtisan } = require('../controllers/artisan.controller')

const router = express.Router();

// signup route
router.post('/signup', registerArtisan);

// login route
router.post('/login', loginArtisan);

module.exports = router

// {
//   "fullName": "Jesse Pinkman",
//   "phone": "08012345678",
//   "email": "legit.com",
//   "password": "123Te",
//   "serviceType": "plumber",
//   "location": "Abuja, Nigeria"
// }