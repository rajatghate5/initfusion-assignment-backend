const express = require("express");
const router = express.Router();
const { adminSignUp, adminLogin } = require("../controllers/loginController");

// Route for admin sign-up
router.post("/signup", adminSignUp);

// Route for admin sign-in (login)
router.post("/signin", adminLogin);

module.exports = router;
