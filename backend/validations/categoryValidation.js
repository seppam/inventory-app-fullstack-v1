const Joi = require("joi");

exports.createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required()
});

exports.updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required()
});

exports.idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required()
});