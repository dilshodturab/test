const { requestBody } = require("../config/utils");
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
