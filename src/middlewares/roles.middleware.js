const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Determine the role attached by protect middleware
    const role =
      req.user?.role || req.artisan?.role || req.admin?.role || null;

    if (!role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

module.exports = authorize;
