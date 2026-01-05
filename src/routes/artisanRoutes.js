const express = require("express");
const router = express.Router();
const artisanController = require("../controllers/artisan.controller");
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/roles.middleware");



// Auth
router.post("/register", artisanController.createArtisan);  // creates new artisan
router.post("/login", artisanController.loginArtisan);   // artisan logs in 

// Protected route example
router.get("/profile/me", protect, (req, res) => {
  res.json(req.artisan);
});

// Admin-only route: list all artisans (including unverified)
router.get("/all", protect, authorize("admin"), artisanController.getAllArtisans);


// Public
router.get("/", artisanController.getArtisans);    // gets all artisan
router.get("/:id", artisanController.getArtisanById);    //gets artisan by id

module.exports = router;
