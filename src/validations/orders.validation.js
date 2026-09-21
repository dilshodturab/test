const Joi = require("joi");

module.exports.orderCreateValidator = Joi.object({
  products: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().lowercase().required(),
      quantity: Joi.number().integer().min(1).max(100).required()
    })
  ).unique("id").min(1).required()
}).required();
