const { pool } = require("./db-connect");
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
  if (!valid) { throw new CustomThrowError(`${name} is not valid UUID`, 400) }

  return str;
}

module.exports.withTransaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch((error) => { throw new CustomThrowError(`Unknown error: ${error}`) });
    throw error;
  } finally {
    client.release();
  }
};
