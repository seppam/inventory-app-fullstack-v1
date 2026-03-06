const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/authService");
const { successResponse } = require("../utils/response");

exports.register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return successResponse(res, 201, "User registered successfully", user);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(
    req.body.email,
    req.body.password
  );

  return successResponse(res, 200, "Login successful", result);
});

exports.getMe = (req, res) => {
  res.status(200).json({
    data: req.user
  });
};