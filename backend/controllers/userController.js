// controllers/userController.js

const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/userService");
const { successResponse } = require("../utils/response");

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  return successResponse(
    res,
    200,
    "Users retrieved successfully",
    users
  );
});

exports.deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.id);

  return successResponse(
    res,
    200,
    "User deleted successfully"
  );
});