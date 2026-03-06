const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const categoryController = require("../controllers/categoryController");
const {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema
} = require("../validations/categoryValidation");
const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

router.post("/", authMiddleware, authorize("admin"), validate(createCategorySchema), categoryController.createCategory);

router.get("/", categoryController.getCategories);

router.get("/:id", validate(idParamSchema, "params"), categoryController.getCategoryById);

router.put("/:id",
  authMiddleware,
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete("/:id",
  authMiddleware,
  authorize("admin"),
  validate(idParamSchema, "params"),
  categoryController.deleteCategory
);

module.exports = router;