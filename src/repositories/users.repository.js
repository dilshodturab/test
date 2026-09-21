const { pool } = require("../config/db-connect")

module.exports = {
  async findByUsername(username) {
    const result = await pool.query(
      `select * from users where username = $1 limit 1`,
      [username]
    );
    return result.rows[0] || null;
  },

  async createUser(data) {
    const result = await pool.query(
      `insert into users (username, password) values ($1, $2) returning id, username`,
      [data.username, data.password]
    );

    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `select id, created_at, username from users where id = $1 limit 1`,
      [id]
    );

    return result.rows[0] || null;
  }
}
