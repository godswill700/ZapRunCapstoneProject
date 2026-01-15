const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Parse URL-encoded bodies (optional, for forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to display where the request is coming from and also what method
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/artisans", require("./routes/artisanRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/users/discover", require("./routes/usersearchRoutes"));
app.use("/api/chat", require("./routes/chatRoute"));
app.use("/api/verification", require("./routes/verificationRoutes"));

// Test homepage
app.get("/", (req, res) => {
  res.send("ZAPRun API is running 🚀");
});

module.exports = app;
