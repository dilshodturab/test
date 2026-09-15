const Joi = require("joi");

module.exports.userValidate = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(4).max(50).required(),
}).required()
