const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/roles.middleware");
const { registerUser, verifyUserEmail, loginUser, getMe } = require("../controllers/user.controller");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUserEmail);

// Protected route: only logged-in user
router.get("/me", protect, authorize("user"), getMe);

module.exports = router;
