const Joi = require("joi");

module.exports.orderCreateValidator = Joi.object({
  products: Joi.array().items(
    Joi.string().uuid().required()
  ).min(1).required()
}).required();
