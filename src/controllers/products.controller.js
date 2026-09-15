const { requestBody } = require("../config/utils");
const { productCreateValidate } = require("../validations/products.validation");
const productsService = require("../services/products.service");

module.exports.create = async (req, res, next) => {
  try {
    await productsService.create(requestBody(req.body, productCreateValidate));
    return res.status(201).json({ success: true, message: "Product successfully created!" });
  } catch (error) { next(error)}
}

module.exports.all = async (req, res, next) => {
  try {
    const result = await productsService.all();
    return res.status(200).json({success: true, data: result})
  } catch(error) { next(error) }
}
