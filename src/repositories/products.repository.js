const { pool } = require("../config/db-connect");

module.exports = {
  async create(data) {
    const result = await pool.query(
      `insert into products (name, price, stock_quantity) values ($1, $2, $3) returning id, name`,
      [data.name, data.price, data.stock_quantity]
    );

    return result.rows[0];
  },

  async subtractOneById(id) {
    const result = await pool.query(
      `update products set stock_quantity = stock_quantity-1 where id = $1 returning id, stock_quantity`,
      [id]
    );

    return result.rows[0];
  },

  async findByName(name) {
    const result = await pool.query(
      `select * from products where name = $1`,
      [name]
    );

    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query(
      `select * from products where id = $1`,
      [id]
    );

    return result.rows[0] || null;
  },

  async all() {
    const result = await pool.query(
      `select * from products`
    );

    return result.rows;
  }
}
