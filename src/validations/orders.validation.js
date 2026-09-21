const Joi = require("joi");

module.exports.orderCreateValidator = Joi.object({
  products: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().required(),
      quantity: Joi.number().min(1).max(100).required()
    })
  ).min(1).required()
}).required();
