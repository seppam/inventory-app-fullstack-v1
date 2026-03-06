const { Product, Category } = require("../models");
const AppError = require("../utils/AppError");
const activityLogService = require("./activityLogService");

exports.createProduct = async (data, userId) => {
    const category = await Category.findById(data.categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    const newProduct = await Product.create({ ...data, createdBy: userId });

    await activityLogService.createLog({
        action: "CREATE",
        entity: "Product",
        entityId: newProduct._id,
        performedBy: userId
    });
    return newProduct;
};

exports.getProducts = async (queryParams) => {
  const {
    page = 1,
    limit = 5,
    search = "",
    category,
    sort = "createdAt",
  } = queryParams;
  const query = {};

  // SEARCH
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // FILTER CATEGORY
  if (category) {
    query.categoryId = category;
  }

  const skip = (page - 1) * limit;

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate("categoryId")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  return {
    products,
    pagination: {
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getProductById = async (id) => {
    const product = await Product.findById(id).populate("categoryId");
    if(!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
};

exports.updateProduct = async (id, data, userId) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { ...data, updatedBy: userId }, 
      { new: true }
    );

    await activityLogService.createLog({
        action: "UPDATE",
        entity: "Product",
        entityId: updatedProduct._id,
        performedBy: userId
    });
    return updatedProduct;
};

exports.deleteProduct = async (id, userId) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    const deletedProduct = await Product.findByIdAndDelete(id);

    await activityLogService.createLog({
        action: "DELETE",
        entity: "Product",
        entityId: deletedProduct._id,
        performedBy: userId
    });
    return deletedProduct;
};