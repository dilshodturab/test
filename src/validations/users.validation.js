const Joi = require("joi");

module.exports.userRegisterValidate = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(4).max(50).required(),
}).required()

module.exports.userLoginValidate = Joi.object({
  username: Joi.string().min(1).max(50).required(),
  password: Joi.string().min(1).max(50).required(),
}).required()
