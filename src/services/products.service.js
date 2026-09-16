const { CustomThrowError } = require("../config/custom-errors");
const productsRepository = require("../repositories/products.repository")

module.exports.create = async (data) => {
  try {
    await productsRepository.create(data);
  } catch (err) {
    if (err.code === "23505") {
      throw new CustomThrowError("Product with this name is already exists!", 409);
    }
    throw err;
  }
}

module.exports.all = async () => {
  return await productsRepository.all();
}
