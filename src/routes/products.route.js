const { Router } = require("express");
const controller = require("../controllers/products.controller");
const { auth } = require("../config/auth");

module.exports.productsRoutes = Router()
  .post("/", auth, controller.create)
  .get("/", auth, controller.all)
