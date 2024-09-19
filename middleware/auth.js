const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Missing token" });
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid token format" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  jwtAuth,
};
