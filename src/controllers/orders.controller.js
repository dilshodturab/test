const { requestBody } = require("../config/utils");
const { orderCreateValidator } = require("../validations/orders.validation");
const ordersService = require("../services/orders.service");

module.exports.create = async (req, res, next) => {
  try {
    const body = requestBody(req.body, orderCreateValidator);
    const data = {
      created_by: req.user.id,
      products: body.products
    }

    await ordersService.create(data);
    res.status(201).json({ success: true, message: "Order created successfully" });
  } catch(error) { next(error) }
}
