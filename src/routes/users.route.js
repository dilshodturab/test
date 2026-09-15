const { Router } = require("express");
const controller = require("../controllers/users.controller");

module.exports.usersRoute = Router()
  .post("/register", controller.register)
