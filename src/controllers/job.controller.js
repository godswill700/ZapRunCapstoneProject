const Job = require("../models/Job");

// CREATE a job (only artisan or admin)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.artisan._id, // attach logged-in user
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: "Failed to create job", error: err.message });
  }
};

// GET all jobs (admin only)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("assignedArtisan", "name email serviceType")
      .populate("createdBy", "name email");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// GET jobs for logged-in artisan
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.artisan._id })
      .populate("assignedArtisan", "name email serviceType");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your jobs", error: err.message });
  }
};

// UPDATE job status (artisan/admin)
exports.updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only admin or assigned artisan can update
    if (req.artisan.role !== "admin" && (!job.assignedArtisan || !job.assignedArtisan.equals(req.artisan._id))) {
      return res.status(403).json({ message: "Forbidden: cannot update this job" });
    }

    job.status = req.body.status || job.status;
    await job.save();

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to update job", error: err.message });
  }
};
