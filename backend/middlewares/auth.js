const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  //console.log("HEADER:", req.headers.authorization);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  req.user = user;
  next();
};