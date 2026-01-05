const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/roles.middleware");

// Create a job (artisan or admin)
router.post("/", protect, authorize("artisan", "admin"), jobController.createJob);

// Get jobs for admin only
router.get("/all", protect, authorize("admin"), jobController.getAllJobs);

// Get logged-in artisan's jobs
router.get("/my", protect, authorize("artisan", "admin"), jobController.getMyJobs);

// Update job status
router.patch("/:id", protect, authorize("artisan", "admin"), jobController.updateJobStatus);

module.exports = router;
