const asyncHandler = require("../middlewares/asyncHandler");
const categoryService = require("../services/categoryService");
const { successResponse } = require("../utils/response");

exports.createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body, req.user.id);
    // res.status(201).json(category);
    return successResponse(
        res,
        201,
        "Category created successfully",
        category
    );
});

exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories();

    return successResponse(
        res,
        200,
        "Categories fetched successfully",
    categories
  );
});

exports.getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    // if (!category) return res.status(404).json({ message: "Not found" });
    return successResponse(
        res,
        200,
        "Category fetched successfully",
        category
    );
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body, req.user.id);
    // if (!category) return res.status(404).json({ message: "Not found" });
    return successResponse(
        res,
        200,
        "Category updated successfully",
        category
    );
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.deleteCategory(req.params.id, req.user.id);
    // if (!category) return res.status(404).json({ message: "Not found" });
    return successResponse(
        res,
        200,
        "Category deleted successfully",
        category
    );
});

// exports.deleteCategory = async (req, res) => {
//   try {
//     const category = await categoryService.deleteCategory(req.params.id);
//     if (!category) return res.status(404).json({ message: "Not found" });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };