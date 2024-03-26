// middleware/auth.js
const jwt = require("jsonwebtoken");
// const config = require("../config"); // Check the relative path to your config file

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token"); // Assuming you send the token in the header

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decoded; // Store the decoded user data in the request object
    next();
  } catch (ex) {
    return res.status(400).json({ message: "Invalid token." });
  }
};