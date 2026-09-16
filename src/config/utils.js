const { CustomThrowError } = require("./custom-errors")

module.exports.requestBody = (body, validator) => {
  const { error, value } = validator.validate(body);
  if (error) {
		throw new CustomThrowError(error, 400)
 	}

  return value;
}

module.exports.isUUID = (name, str) => {
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
  if(!valid) {throw new CustomThrowError(`${name} is not valid UUID`, 400)}

  return str;
}
