const { requestBody } = require("../config/utils")
const { userValidate } = require("../validations/users.validation")
const usersService = require("../services/users.service");

module.exports.register = async(req, res, next) => {
  try {
    const createdUser = await usersService.register(await requestBody(req.body, userValidate))
    res.status(201).json({ success: true, message: "User successfully created", data: createdUser.token });
  } catch (error) { next(error) }
}
