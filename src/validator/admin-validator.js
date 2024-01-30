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