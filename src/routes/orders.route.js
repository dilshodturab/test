const { Router } = require("express");
const controller = require("../controllers/orders.controller");
const { auth } = require("../config/auth");

module.exports.ordersRoutes = Router()
  .post("/", auth, controller.create)
  .get("/", auth, controller.all)
  .get("/:id", auth, controller.getStatus)
  .post("/:id/cancel", auth, controller.cancel)
