const { Router } = require("express");
const controller = require("../controllers/orders.controller");
const { auth } = require("../config/auth");

module.exports.ordersRoutes = Router()
  .post("/", auth, controller.create)
