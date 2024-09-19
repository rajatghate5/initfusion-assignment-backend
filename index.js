const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const { jwtAuth } = require("./middleware/auth"); // Destructure jwtAuth from the auth module
const adminRoutes = require("./routes/loginRoutes"); // Import routes
const schoolRoutes = require("./routes/scheduleRoutes");

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse JSON payloads
app.use(cors());

// Apply routes
app.use("/auth", adminRoutes); // Mount routes on /auth
app.use("/api/v1", jwtAuth, schoolRoutes); // Apply jwtAuth to /api/v1 routes

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Problem connecting with database:", error);
  });
