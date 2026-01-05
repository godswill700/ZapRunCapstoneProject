const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const protect = require('../middlewares/auth.middleware');


router.post('/', reviewController.createReview);

// Public: view reviews for an artisan
router.get("/artisan/:artisanId", reviewController.getArtisanReviews);

// Create review (authenticated users only)
router.post("/", protect, reviewController.createReview);

module.exports = router;
