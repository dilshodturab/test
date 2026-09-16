const { pool } = require("../config/db-connect")

module.exports = {
  async create(data) {
    const result = await pool.query(
      `insert into orders (idem_key, created_by, products) values ($1, $2, $3) returning id`,
      [data.idem_key, data.created_by, data.products]
    );

    return result.rows[0];
  },

  async find(key, value) {
    const result = await pool.query(
      `select * from orders where ${key} = $1`,
      [value]
    );

    return result.rows;
  },

  async findBy(key, value) {
    const result = await pool.query(
      `select * from orders where ${key}=$1 limit 1`,
      [value]
    );

    return result.rows[0] || null;
  },
}
