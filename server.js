require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');
const artisanRoutes = require('./routes/artisan');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/artisan', artisanRoutes);
app.use('/api/admin', adminRoutes);

connectDB(app);
