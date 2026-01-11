// config/env.js
require("dotenv").config();

module.exports = () => {
  const required = [
    "MONGO_URI",
    "JWT_SECRET",
    "AUTH_EMAIL",
    "CLIENT_ID",
    "CLIENT_SECRET",
    "REFRESH_TOKEN",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing environment variables: ${missing.join(", ")}`
    );
  }
};
