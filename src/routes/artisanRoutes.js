const express = require("express");
const router = express.Router();
const { upload } = require('../middlewares/workSamplesUpload');
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/roles.middleware");
const artisanController = require("../controllers/artisan.controller");

// Public routes
router.post("/register", artisanController.createArtisan);
router.post("/login", artisanController.loginArtisan);

// Verification routes via otp and onboarding
router.post("/verify-email", artisanController.verifyArtisanEmail);
router.post("/resend-otp", artisanController.resendOtp);
router.post("/onboard", upload.array("images", 10), artisanController.onboarding);


// Protected routes
router.get("/profile/me", protect, authorize("artisan"), (req, res) => {
  res.json(req.artisan);
});

// Admin-only: list all artisans
router.get("/all", protect, authorize("admin"), artisanController.getAllArtisans);

// Public artisan listings
router.get("/", artisanController.getArtisans);
router.get("/featured", artisanController.getFeaturedArtisans);
router.get("/top", artisanController.getTopArtisans);
router.get("/:id", artisanController.getArtisanById);

module.exports = router;
