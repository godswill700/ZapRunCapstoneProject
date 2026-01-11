const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/roles.middleware");
const adminController = require("../controllers/admin.controller");

// Admin login
router.post("/login", adminController.loginAdmin);

// Protected admin-only routes
router.get("/dashboard", protect, authorize("admin"), adminController.getDashboard);

// Add more admin routes here

module.exports = router;
