const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Artisan = require("../models/Artisan");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the correct model to request based on role
      if (decoded.role === "user") {
        req.user = await User.findById(decoded.id).select("-password");
      } else if (decoded.role === "artisan") {
        req.artisan = await Artisan.findById(decoded.id).select("-password");
      } else if (decoded.role === "admin") {
        req.admin = await Admin.findById(decoded.id).select("-password");
      } else {
        return res.status(401).json({ message: "Invalid token role" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;
