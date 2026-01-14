const Job = require("../models/Job");
const { createChatForJob } = require('./chat.controller');

// CREATE a job
const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.user._id, // use req.user if middleware attaches logged-in user
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: "Failed to create job", error: err.message });
  }
};

// GET all jobs (admin only)
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("assignedArtisan", "name email serviceType")
      .populate("createdBy", "name email");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// GET job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("assignedArtisan", "name email serviceType")
      .populate("createdBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job", error: err.message });
  }
};

// Assign job to artisan (admin only)
const assignJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.assignedArtisan = req.body.artisanId;
    await job.save();

    // Create Chat for Job when job has been assigned
    await createChatForJob(job._id, job.createdBy, job.assignedArtisan);

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to assign job", error: err.message });
  }
};

// UPDATE job status
const updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (
      req.user.role !== "admin" &&
      (!job.assignedArtisan || !job.assignedArtisan.equals(req.user._id))
    ) {
      return res.status(403).json({ message: "Forbidden: cannot update this job" });
    }

    job.status = req.body.status || job.status;
    await job.save();

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to update job", error: err.message });
  }
};

// EXPORT all handlers
module.exports = {
  createJob,
  getJobs,
  getJobById,
  assignJob,
  updateJobStatus,
};
