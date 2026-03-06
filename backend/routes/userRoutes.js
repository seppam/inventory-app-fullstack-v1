const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const userController = require("../controllers/userController");

// Admin only
router.use(auth, authorize("admin"));

router.get("/", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);

module.exports = router;