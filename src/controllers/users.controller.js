const { requestBody } = require("../config/utils")
const { userRegisterValidate, userLoginValidate } = require("../validations/users.validation")
const usersService = require("../services/users.service");

module.exports.register = async(req, res, next) => {
  try {
    const token = await usersService.register(requestBody(req.body, userRegisterValidate));
    res.status(201).json({ success: true, message: "User successfully created", data: token });
  } catch (error) { next(error) }
}

module.exports.login = async (req, res, next) => {
  try {
    const token = await usersService.login(requestBody(req.body, userLoginValidate));
    res.status(200).json({success: true, message: "Successfull login", data: token})
  } catch (error) { next(error) }
}
