const { CustomThrowError } = require("../config/custom-errors");
const productsRepository = require("../repositories/products.repository")

module.exports.create = async (data) => {
  const exists = await productsRepository.findBy("name", data.name);
  if (exists) { throw new CustomThrowError("Product with this name is already exists!", 409) }

  await productsRepository.create(data);
}

module.exports.all = async () => {
  return await productsRepository.all();
}
