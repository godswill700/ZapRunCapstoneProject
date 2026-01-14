const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/workSamplesUpload');
const { reviewVerification, getCompletedVerifications, getPendingVerifications, submitVerification } = require('../controllers/verification.controller');

// Artisan Submits verification
router.post("/submit/:artisanId", upload.array("documents", 5), submitVerification);

// Admin routes
router.get("/pending", getPendingVerifications);

router.get("/completed", getCompletedVerifications);

router.patch("/review/:verificationId", reviewVerification);

module.exports = router;