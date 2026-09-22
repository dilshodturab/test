const { CustomThrowError } = require("../config/custom-errors");
const { redisClient } = require("../config/redis-connect");
const { isUUID, withTransaction } = require("../config/utils");
const ordersRepository = require("../repositories/orders.repository");
const productsRepository = require("../repositories/products.repository");
const PRODUCTS_CACHE_KEY = "products:all";

module.exports.create = async (data) => {
  const idemKey = isUUID("Idempotency key", data.idem_key);
  const items = data.products;
  const ids = items.map((p) => p.id);
  const qtys = items.map((p) => p.quantity);
  const wanted = new Map(items.map((p) => [p.id, p.quantity]));

  const result = await withTransaction(async (client) => {
    const order = await ordersRepository.create({ idem_key: idemKey, created_by: data.created_by }, client);
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

  if (!result.replayed) {
    try {
      await redisClient.del(PRODUCTS_CACHE_KEY);
    } catch (error) { console.log("Redis del error:", error.message) }
  }

  return result;
};

module.exports.findAllOrdersOfUser = async (userId) => {
  return await ordersRepository.find("created_by", userId);
}

const cancelAndRestoreStock = (orderId) => withTransaction(async (client) => {
  const cancelled = await ordersRepository.cancelIfPending(orderId, client);
  if (!cancelled) return null;

  const items = await ordersRepository.findItems(orderId, client);
  const ids = items.map((i) => i.id);
  const qtys = items.map((i) => i.quantity);

  await productsRepository.lockByIds(ids, client);
  await productsRepository.restoreMany(ids, qtys, client);

  return cancelled;
});

module.exports.autoCancelOrders = async () => {
  const orders = await ordersRepository.findPendingOrders();

  for (const order of orders) {
    try {
      await cancelAndRestoreStock(order.id);
    } catch (error) {
      console.log(`Auto-cancel failed for order ${order.id}:`, error.message);
    }
  }
};

module.exports.getStatus = async (data) => {
  const foundOrder = await ordersRepository.findOrder(data);
  if (!foundOrder) { throw new CustomThrowError("Order is not found", 404) }

  return foundOrder.status;
}

module.exports.confirm = async (orderId, userId) => {
  const order = await ordersRepository.findBy("id", orderId);
  if (!order) { throw new CustomThrowError("Order not found", 404) }
  if (order.status !== "pending") { throw new CustomThrowError("Only pending orders can be confirmed", 409) }
  if (order.created_by !== userId) { throw new CustomThrowError("Forbidden: You cannot confirm this order", 403) }

  return await ordersRepository.confirm(orderId);
}

module.exports.cancel = async (orderId, userId) => {
  const order = await ordersRepository.findBy("id", orderId);
  if (!order) { throw new CustomThrowError("Order not found", 404) }
  if (order.created_by !== userId) { throw new CustomThrowError("Forbidden: You cannot cancel this order", 403) }
  if (order.status !== "pending") { throw new CustomThrowError("Only pending orders can be cancelled", 409) }

  const result = await withTransaction(async (client) => {
    const cancelled = await ordersRepository.cancelIfPending(orderId, client);
    if (!cancelled) { throw new CustomThrowError("Only pending orders can be cancelled", 409) }

    const items = await ordersRepository.findItems(orderId, client);
    const ids = items.map((i) => i.id);
    const qtys = items.map((i) => i.quantity);

    await productsRepository.lockByIds(ids, client);
    await productsRepository.restoreMany(ids, qtys, client);

    return cancelled;
  });

  if (result) {
    try {
      await redisClient.del(PRODUCTS_CACHE_KEY);
    } catch (error) { console.log("Redis del error:", error.message) }
  }

  return result;
}
