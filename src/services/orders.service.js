const { CustomThrowError } = require("../config/custom-errors");
const { isUUID, withTransaction } = require("../config/utils");
const ordersRepository = require("../repositories/orders.repository");
const productsRepository = require("../repositories/products.repository");

module.exports.create = async (data) => {
  const idemKey = isUUID("Idempotency key", data.idem_key);
  const items = data.products;
  const ids = items.map((p) => p.id);
  const qtys = items.map((p) => p.quantity);
  const wanted = new Map(items.map((p) => [p.id, p.quantity]));

  return withTransaction(async (client) => {
    const order = await ordersRepository.create({ idem_key: idemKey, created_by: data.created_by }, client);
    console.log("order", order)
    if (!order) {
      const existing = await ordersRepository.findByIdemKey(idemKey, data.created_by, client);
      return { order: existing, replayed: true };
    }

    const rows = await productsRepository.lockByIds(ids, client);
    const stock = new Map(rows.map((r) => [r.id, r.stock_quantity]));

    for (const [id, qty] of wanted) {
      if (!stock.has(id)) throw new CustomThrowError(`${id} is not found`, 404);
      if (stock.get(id) < qty) throw new CustomThrowError("Not enough stock", 409);
    }

    await productsRepository.subtractMany(ids, qtys, client);
    await ordersRepository.createItems(order.id, ids, qtys, client);
    return { order, replayed: false };
  });
};

module.exports.findAllOrdersOfUser = async (userId) => {
  return await ordersRepository.find("created_by", userId);
}

module.exports.autoCancelOrders = async () => {
  const orders = await ordersRepository.findPendingOrders();

  for (let order of orders) {
    await ordersRepository.cancel(order.id);
  }
}

module.exports.getStatus = async (orderId) => {
  const validId = isUUID("Order id", orderId);

  const foundOrder = await ordersRepository.findBy("id", validId);
  if (!foundOrder) { throw new CustomThrowError("Order is not found", 404) }

  return foundOrder.status;
}

module.exports.confirm = async (orderId, userId) => {
  const order = await ordersRepository.findBy("id", orderId);
  if (!order) { throw new CustomThrowError("Order not found", 404) }
  if (order.status !== "pending") { throw new CustomThrowError("Only pending orders can be confirmed", 409) }
  if (order.created_by !== userId) { throw new CustomThrowError("Fobidden: You cannot confirm this order", 403) }

  return await ordersRepository.confirm(orderId);
}

module.exports.cancel = async (orderId, userId) => {
  const order = await ordersRepository.findBy("id", orderId);
  if (!order) { throw new CustomThrowError("Order not found", 404) }
  if (order.created_by !== userId) { throw new CustomThrowError("Fobidden: You cannot cancel this order", 403) }
  if (order.status !== "pending") { throw new CustomThrowError("Only pending orders can be cancelled", 409) }

  for (let productId of order.products) { await productsRepository.restoreStockQty(productId) }
  return await ordersRepository.cancel(orderId);
}
