const Artisan = require("../models/Artisan");


// User: Search & Filter Artisans

const searchArtisans = async (req, res) => {
  try {
    const {
      location,
      service,
      sortBy = "best_match",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      verificationStatus: "verified",
      isActive: true,
    };

    if (service) {
      query.serviceType = service.toLowerCase();
    }

    if (location) {
      query.location = new RegExp(location, "i");
    }

    let artisans = await Artisan.find(query).select("-password -idCard");

    // Sorting
    switch (sortBy) {
      case "rating":
        artisans.sort((a, b) => b.averageRating - a.averageRating);
        break;
      default:
        artisans.sort((a, b) => {
          const scoreA = a.averageRating * 0.7 + a.experienceYears * 0.3;
          const scoreB = b.averageRating * 0.7 + b.experienceYears * 0.3;
          return scoreB - scoreA;
        });
    }

    // Pagination
    const total = artisans.length;
    const start = (page - 1) * limit;
    const data = artisans.slice(start, start + Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};


// Top Rated Experts

const getTopRatedExperts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const artisans = await Artisan.find({
      verificationStatus: "verified",
      isActive: true,
      averageRating: { $gte: 3.5 },
    })
      .select("-password -idCard")
      .sort({ averageRating: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: artisans.length,
      data: artisans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Public Artisan Profile

const getArtisanProfile = async (req, res) => {
  try {
    const artisan = await Artisan.findOne({
      _id: req.params.id,
      verificationStatus: "verified",
      isActive: true,
    }).select("-password -idCard");

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: "Artisan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: artisan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Available Services (Dropdown)

const getAvailableServices = async (req, res) => {
  try {
    const services = await Artisan.aggregate([
      { $match: { verificationStatus: "verified", isActive: true } },
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: services.map((s) => ({
        value: s._id,
        label: s._id.charAt(0).toUpperCase() + s._id.slice(1),
        count: s.count,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Available Locations (Dropdown)

const getAvailableLocations = async (req, res) => {
  try {
    const locations = await Artisan.distinct("location", {
      verificationStatus: "verified",
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: locations.filter(Boolean).sort(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Filter Options (sort, services, distance)

const getFilterOptions = async (req, res) => {
  try {
    const services = await Artisan.distinct("serviceType", {
      verificationStatus: "verified",
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        sortOptions: [
          { value: "best_match", label: "Best match" },
          { value: "rating", label: "Highest rated" },
        ],
        professionOptions: services.map((p) => ({
          value: p,
          label: p.charAt(0).toUpperCase() + p.slice(1),
        })),
        distanceOptions: [
          { value: "under5", label: "< 5km" },
          { value: "5to20", label: "5km – 20km" },
          { value: "over40", label: "> 40km" },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Export all controllers

module.exports = {
  searchArtisans,
  getTopRatedExperts,
  getArtisanProfile,
  getAvailableServices,
  getAvailableLocations,
  getFilterOptions,
};
