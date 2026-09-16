const { CustomThrowError } = require("../config/custom-errors");
const { isUUID } = require("../config/utils");
const ordersRepository = require("../repositories/orders.repository");
const productsRepository = require("../repositories/products.repository");

module.exports.create = async (data) => {
  const productsIds = data.products;
  const idemKey = isUUID("Idempotency key", data.idem_key);

  const validIdemKey = await ordersRepository.findBy("idem_key", idemKey);
  if (validIdemKey) { return validIdemKey; }

  for (let productId of productsIds) {
    const foundProduct = await productsRepository.findBy("id", productId);
    if (!foundProduct) { throw new CustomThrowError(`${productId} is not found`, 404) }
    if(foundProduct.stock_quantity <= 0){ throw new CustomThrowError("Not enough stock", 409)}
  }

  for (let productId of productsIds) { await productsRepository.subtractOneById(productId) }

  return await ordersRepository.create(data);
}

module.exports.findAllOrdersOfUser = async (userId) => {
  return await ordersRepository.find("created_by", userId);
}

module.exports.getStatus = async (orderId) => {
  const validId = isUUID("Order id", orderId);

  const foundOrder = await ordersRepository.findBy("id", validId);
  if(!foundOrder) { throw new CustomThrowError("Order is not found", 404)}

  return foundOrder.status;
}

module.exports.confirm = async (orderId, userId) => {
  const order = await ordersRepository.findBy("id", orderId);
  if(!order) {throw new CustomThrowError("Order not found", 404)}
  if(order.status !== "pending") { throw new CustomThrowError("Only pending orders can be confirmed", 409)}
  if(order.created_by !== userId) { throw new CustomThrowError("Fobidden: You cannot confirm this order", 403)}

  return await ordersRepository.confirm(orderId);
}

module.exports.cancel = async (orderId, userId) => {
  const order = await ordersRepository.findBy("id", orderId);
  if(!order) {throw new CustomThrowError("Order not found", 404)}
  if(order.created_by !== userId) { throw new CustomThrowError("Fobidden: You cannot cancel this order", 403)}
  if(order.status !== "pending") { throw new CustomThrowError("Only pending orders can be cancelled", 409)}

  for (let productId of order.products) { await productsRepository.restoreStockQty(productId) }
  return await ordersRepository.cancel(orderId);
}
