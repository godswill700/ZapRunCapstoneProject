const Artisan = require("../models/Artisan");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};


//        Register ARTISAN

exports.createArtisan = async (req, res) => {
  try {
    const { email } = req.body;

    // Prevent duplicate registration
    const exists = await Artisan.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const artisan = await Artisan.create(req.body);

    res.status(201).json({
      message: "Artisan created. Awaiting verification.",
      token: generateToken(artisan._id),
      artisan: {
        id: artisan._id,
        name: artisan.name,
        email: artisan.email,
        serviceType: artisan.serviceType,
        verified: artisan.verified,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid artisan data",
      error: err.message,
    });
  }
};

//     LOGIN ARTISAN 

exports.loginArtisan = async (req, res) => {
  try {
    const { email, password } = req.body;

    const artisan = await Artisan.findOne({ email });
    if (!artisan) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await artisan.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(artisan._id),
      artisan: {
        id: artisan._id,
        name: artisan.name,
        email: artisan.email,
        serviceType: artisan.serviceType,
        verified: artisan.verified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//      GET ALL VERIFIED ARTISANS

exports.getArtisans = async (req, res) => {
  try {
    const filter = { verified: true };

    if (req.query.serviceType) filter.serviceType = req.query.serviceType;
    if (req.query.city) filter["location.city"] = req.query.city;

    const artisans = await Artisan.find(filter).select("-password");
    res.status(200).json(artisans);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch artisans",
      error: err.message,
    });
  }
};


//      GET Artisan by id

exports.getArtisanById = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id).select("-password");

    if (!artisan || !artisan.verified) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    res.status(200).json(artisan);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching artisan",
      error: err.message,
    });
  }
};

// GET ALL ARTISANS (admin only)
exports.getAllArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.find().select("-password");
    res.status(200).json(artisans);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch artisans",
      error: err.message,
    });
  }
};

