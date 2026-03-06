const { Category } = require("../models");
const AppError = require("../utils/AppError");
const activityLogService = require("./activityLogService");

exports.createCategory = async (data, userId) => {
  const existing = await Category.findOne({ name: data.name });
  if (existing) {
    throw new AppError("Category already exists", 400);
  }
  const newCategory = await Category.create({ ...data, createdBy: userId });

  await activityLogService.createLog({
    action: "CREATE",
    entity: "Category",
    entityId: newCategory._id,
    performedBy: userId
  });
  return newCategory;
};

exports.getCategories = async () => {
    return await Category.find();
    // if(!categories) throw new AppError("Categories not found", 404);
};

exports.getCategoryById = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new AppError("Category not found", 404);
    }
    return category;
};

exports.updateCategory = async (id, data, userId) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new AppError("Category not found", 404);
    }
    const updatedCategory = await Category.findByIdAndUpdate(
        id, 
        { ...data, updatedBy: userId }, 
        { new: true }
    );

    await activityLogService.createLog({
        action: "UPDATE",
        entity: "Category",
        entityId: updatedCategory._id,
        performedBy: userId
    });
    return updatedCategory;
};

exports.deleteCategory = async (id, userId) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new AppError("Category not found", 404);
    }
    const deletedCategory = await Category.findByIdAndDelete(id);

    await activityLogService.createLog({
        action: "DELETE",
        entity: "Category",
        entityId: deletedCategory._id,
        performedBy: userId
    });
    return deletedCategory;
};