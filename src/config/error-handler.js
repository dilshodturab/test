const { CustomCatchError } = require("./custom-errors");

module.exports.errorHandler = async (err, req, res, next) => {
  void next;
  const e = new CustomCatchError(err);
  console(`Error: ${e.error}, status: ${e.status}`);

  return res.status(e.status).json({
    success: false,
    message: e.error,
  });
}
