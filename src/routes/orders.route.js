const { Router } = require("express");
const controller = require("../controllers/orders.controller");

module.exports.ordersRoutes = Router()
  .post("/", controller.create)
