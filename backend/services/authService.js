const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const AppError = require("../utils/AppError");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.register = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Only whitelist fields: never accept "role" from the client (privilege escalation).
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  const token = generateToken(user);
  user.password = undefined;

  return { user, token };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user);

  user.password = undefined;

  return { user, token };
};