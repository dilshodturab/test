const { CustomThrowError } = require("../config/custom-errors");
const { isUUID } = require("../config/utils");
const ordersRepository = require("../repositories/orders.repository");
const productsRepository = require("../repositories/products.repository");

module.exports.create = async (data) => {
  const productsIds = data.products;
  const idemKey = isUUID("Idempotency key", data.idem_key);

  const validIdemKey = await ordersRepository.findByIdemKey(idemKey);
  if (validIdemKey) { return validIdemKey; }

  for (let productId of productsIds) {
    const foundOrder = await productsRepository.findById(productId);
    if (!foundOrder) {
      throw new CustomThrowError(`${productId} is not found`, 404);
    }
  }

  for (let productId of productsIds) {
    await productsRepository.subtractOneById(productId);
  }

  return await ordersRepository.create(data);
}
