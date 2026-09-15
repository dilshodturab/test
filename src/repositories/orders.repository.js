const { pool } = require("../config/db-connect")

module.exports = {
  async create(data) {
    await pool.query(
      `insert into orders (created_by, products) values ($1, $2)`,
      [data.created_by, data.products]
    )
  }
}
