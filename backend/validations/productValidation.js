const Joi = require("joi");

exports.createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).allow("", null),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  categoryId: Joi.string().length(24).hex().required()
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(500).allow("", null),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  categoryId: Joi.string().length(24).hex()
}).min(1);

exports.idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required()
});