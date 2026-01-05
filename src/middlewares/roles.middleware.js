const authorize = (...allowedRoles) => {
   return (req, res, next) => {
     if (!req.artisan) {
       return res.status(401).json({ message: "Not authenticated" });
     }
 
     if (!allowedRoles.includes(req.artisan.role)) {
       return res.status(403).json({ message: "Forbidden: Access denied" });
     }
 
     next();
   };
 };
 
 module.exports = authorize;
 