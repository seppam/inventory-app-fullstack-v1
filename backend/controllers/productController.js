const productService = require("../services/productService");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");


exports.createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body, req.user.id);
    return successResponse(
      res,
      201,
      "Product created successfully",
      product
    );
});

exports.getProducts = asyncHandler(async (req, res) => {
    const products = await productService.getProducts(req.query);
    return successResponse(
      res,
      200,
      "Products fetched successfully",
      products
    );
});

exports.getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    return successResponse(
      res,
      200,
      "Product fetched successfully",
      product
    );
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body, req.user.id);
    return successResponse(
      res,
      200,
      "Product updated successfully",
      product
    );
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await productService.deleteProduct(req.params.id, req.user.id); 
    return successResponse(
      res,
      200,
      "Product deleted successfully",
      product
    );
});

