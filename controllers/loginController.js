const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Login"); // Adjust the path to your User model

// Utility function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" } // Token expiration time
  );
};

const adminSignUp = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Send a success response without token
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in adminSignUp:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin login controller
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  adminSignUp,
  adminLogin,
};
