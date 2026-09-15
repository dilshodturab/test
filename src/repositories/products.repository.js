const { pool } = require("../config/db-connect");

module.exports = {
  async create(data) {
    const result = await pool.query(
      `insert into products (name, price, stock_quantity) values ($1, $2, $3) returning id, name`,
      [data.name, data.price, data.stock_quantity]
    );

    return result.rows[0];
  },

  async findByName(name) {
    const result = await pool.query(
      `select * from products where name = $1`,
      [name]
    );

    return result.rows[0] || null;
  }
}
