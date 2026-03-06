const { User, Product, Category, ActivityLog } = require("../models");

exports.getSummary = async () => {
  const [
    totalUsers,
    totalProducts,
    totalCategories,
    adminCount,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    User.countDocuments({ role: "admin" }),
  ]);

  return {
    totalUsers,
    totalProducts,
    totalCategories,
    adminCount,
  };
};

exports.getRecentActivity = async () => {
  const logs = await ActivityLog.find()
    .populate("performedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  return logs;
};