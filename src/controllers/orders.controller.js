const { requestBody, isUUID } = require("../config/utils");
const { orderCreateValidator } = require("../validations/orders.validation");
const ordersService = require("../services/orders.service");
const { CustomThrowError } = require("../config/custom-errors");

module.exports.create = async (req, res, next) => {
  try {
    const idem_key = req.headers["idempotency-key"];
    if(!idem_key) { throw new CustomThrowError("Idempotency key is required")}

    const body = requestBody(req.body, orderCreateValidator);
    const data = {
      idem_key: idem_key,
      created_by: req.user.id,
      products: body.products
    }

    await ordersService.create(data);
    res.status(201).json({ success: true, message: "Order created successfully" });
  } catch(error) { next(error) }
}

module.exports.all = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await ordersService.findAllOrdersOfUser(userId);
    return res.status(200).json({ success: true, data });
  } catch(error) {next(error)}
}

module.exports.getStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const status = await ordersService.getStatus(orderId);
    return res.status(200).json({ success: true, status });
  } catch(error) {next(error)}
}

module.exports.confirm = async (req, res, next) => {
  try{
    const userId = req.user.id;
    const orderId = isUUID("Order id", req.params.id);
    await ordersService.confirm(orderId, userId);
    return res.status(200).json({ success: true, message: "Order confirmed successfully" });
  }catch(error) {next(error)}
}

module.exports.cancel = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = isUUID("Order id", req.params.id);
    await ordersService.cancel(orderId, userId);
    return res.status(200).json({ success: true, message: "Your order successfully cancelled" });
  } catch(error) {next(error)}
}
