const Review = require("../models/Review");
const Job = require("../models/Job");

exports.createReview = async (req, res) => {
  try {
    const { jobId, rating, comment } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Job must be completed
    if (job.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Only completed jobs can be reviewed" });
    }

    // Reviewer must be involved in the job
    const isInvolved =
      job.createdBy.equals(req.artisan._id) ||
      (job.assignedArtisan &&
        job.assignedArtisan.equals(req.artisan._id));

    if (!isInvolved) {
      return res
        .status(403)
        .json({ message: "You are not allowed to review this job" });
    }

    // Determine who is being reviewed
    const reviewee = job.assignedArtisan.equals(req.artisan._id)
      ? job.createdBy
      : job.assignedArtisan;

    const review = await Review.create({
      rating,
      comment,
      job: job._id,
      reviewer: req.artisan._id,
      reviewee,
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You already reviewed this job" });
    }

    res.status(500).json({ message: err.message });
  }
};

// GET reviews for an artisan
exports.getArtisanReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.artisanId })
      .populate("reviewer", "name")
      .populate("job", "title");

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
