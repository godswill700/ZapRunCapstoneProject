const mongoose = require('mongoose');

const connectDB = async (app) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('db connected');
    // listen requests
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running on port ' + process.env.PORT);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;