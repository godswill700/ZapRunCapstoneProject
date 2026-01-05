const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = require("./config/db");

connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Routes (ONLY load what exists)
app.use("/api/artisans", require("./routes/artisanRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));



// hompage route
app.get("/", (req, res) => {
  res.send("ZAPRun API is running 🚀");
});

module.exports = app;
