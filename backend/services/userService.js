const activityLogService = require("./activityLogService");
const { User } = require("../models");
const AppError = require("../utils/AppError");

// GET /users
exports.getAllUsers = async () => {
  try {
    const users = await User.find().select("-password");

    return users;
  } catch (err) {
    throw err;
  }
};

exports.deleteUser = async (userId, currentUserId) => {
  if (userId === currentUserId) {
    throw new AppError("Admin cannot delete their own account", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await user.deleteOne();

  await activityLogService.createLog({
    action: "DELETE",
    entity: "User",
    entityId: user._id,
    performedBy: currentUserId,
  });

  return true;
};
