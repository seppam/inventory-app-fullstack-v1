const asyncHandler = require("../middlewares/asyncHandler");
const dashboardService = require("../services/dashboardService");
const { successResponse } = require("../utils/response");

exports.getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary();

  return successResponse(
    res,
    200,
    "Dashboard summary retrieved",
    summary
  );
});

exports.getRecentActivity = asyncHandler(async (req, res) => {
  const logs = await dashboardService.getRecentActivity();

  return successResponse(
    res,
    200,
    "Recent activity retrieved",
    logs
  );
});