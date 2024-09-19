// config/database.js
const mongoose = require("mongoose");
require("dotenv").config(); // Ensure environment variables are loaded

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
