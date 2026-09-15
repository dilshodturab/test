const Joi = require("joi");

module.exports.productCreateValidate = Joi.object({
  name: Joi.string().max(40).required(),
  price: Joi.number().greater(0).required(),
  stock_quantity: Joi.number().greater(0).required()
}).required();
