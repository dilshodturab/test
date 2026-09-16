const { Router } = require("express");
const controller = require("../controllers/orders.controller");
const { auth } = require("../config/auth");

module.exports.ordersRoutes = Router()
  .post("/", auth, controller.create)
  .post("/:id/confirm", auth, controller.confirm)
  .post("/:id/cancel", auth, controller.cancel)
  .get("/", auth, controller.all)
  .get("/:id", auth, controller.getStatus)
