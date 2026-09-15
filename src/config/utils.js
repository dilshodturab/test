const { CustomThrowError } = require("./custom-errors")

module.exports.requestBody = (body, validator) => {
  const { error, value } = validator.validate(body);
  if (error) {
		throw new CustomThrowError(error, 400)
 	}

  return value;
}
