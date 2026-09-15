const { requestBody } = require("../config/utils")
const { userValidate } = require("../validations/users.validation")
const usersService = require("../services/users.service");

module.exports.register = async(req, res, next) => {
  try {
    const createdUser = await usersService.register(requestBody(req.body, userValidate));
    res.status(201).json({ success: true, message: "User successfully created", data: createdUser.token });
  } catch (error) { next(error) }
}

module.exports.login = async (req, res, next) => {
  try {
    const user = await usersService.login(requestBody(req.body, userValidate));
    res.status(200).json({success: true, message: "Successfull login", data: user.token})
  } catch (error) { next(error) }
}
