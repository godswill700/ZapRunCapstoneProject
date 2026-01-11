const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/roles.middleware");
const jobController = require("../controllers/job.controller");

// User creates job
router.post("/", protect, authorize("user"), jobController.createJob);

// Get all jobs (any logged-in user)
router.get("/", protect, jobController.getJobs);
router.get("/:id", protect, jobController.getJobById);

// Admin assigns artisan
router.patch("/:id/assign", protect, authorize("admin"), jobController.assignJob);

// Artisan updates job status
router.patch("/:id/status", protect, authorize("artisan"), jobController.updateJobStatus);

module.exports = router;
