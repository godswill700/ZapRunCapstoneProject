const express = require("express");
const router = express.Router();

const {
  searchArtisans,
  getTopRatedExperts,
  getArtisanProfile,
  getAvailableServices,
  getAvailableLocations,
  getFilterOptions,
} = require("../controllers/usersearch.controller");

router.get("/search", searchArtisans);
router.get("/top-rated", getTopRatedExperts);
router.get("/filters", getFilterOptions);
router.get("/services", getAvailableServices);
router.get("/locations", getAvailableLocations);
router.get("/artisan/:id", getArtisanProfile);



module.exports = router;
