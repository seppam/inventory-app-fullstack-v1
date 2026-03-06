const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const dashboardController = require("../controllers/dashboardController");

router.use(auth, authorize("admin"));

router.get("/summary", dashboardController.getSummary);
router.get("/recent-activity", dashboardController.getRecentActivity);

module.exports = router;