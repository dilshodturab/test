const ordersRepository = require("../repositories/orders.repository");

module.exports.create = async (data) => {

  await ordersRepository.create(data)

}
