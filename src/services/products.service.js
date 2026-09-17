const { CustomThrowError } = require("../config/custom-errors");
const { redisClient } = require("../config/redis-connect");
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
  const CACHE_KEY = "products:all";
  const CACHE_TTL = 60 * 60 * 24;

  try {
    const cached = await redisClient.get(CACHE_KEY);
    if(cached) {return JSON.parse(cached)}
  } catch(error) {console.log(error.message)}

  const result = await productsRepository.all();

  try {
    await redisClient.set(CACHE_KEY, JSON.stringify(result), { EX: CACHE_TTL });
  } catch(error) {console.log("Redis write error: ", error.message)}

  return result;
}
