const Joi = require("joi");

exports.createProductSchema = Joi.object({
  stock: Joi.number(),
  version: Joi.string(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  detail: Joi.string().required(),
  scale: Joi.string().required(),
  weight: Joi.number().required(),
  material: Joi.string().required(),
  brandId: Joi.number().required().strip(),
  collectionId: Joi.number().required().strip(),
  seriesId: Joi.number().required().strip(),
});

exports.updateProductSchema = Joi.object({
  stock: Joi.number(),
  version: Joi.string(),
  name: Joi.string(),
  price: Joi.number(),
  detail: Joi.string(),
  scale: Joi.string(),
  weight: Joi.number(),
  material: Joi.string(),
  brandId: Joi.number(),
  collectionId: Joi.number(),
  seriesId: Joi.number(),
});