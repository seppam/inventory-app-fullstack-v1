const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const productController = require("../controllers/productController");
const {
    createProductSchema,
    updateProductSchema,
    idParamSchema
} = require("../validations/productValidation");
const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

router.post("/", authMiddleware, authorize("admin"), validate(createProductSchema), productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", validate(idParamSchema, "params"), productController.getProductById);
router.put("/:id", authMiddleware, authorize("admin"), validate(idParamSchema, "params"), validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", authMiddleware, authorize("admin"), validate(idParamSchema, "params"), productController.deleteProduct);

module.exports = router;