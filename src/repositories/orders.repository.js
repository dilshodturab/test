const { pool } = require("../config/db-connect")

module.exports = {
  async create({ idem_key, created_by }, db = pool) {
    const result = await db.query(
      `insert into orders (idem_key, created_by) values ($1, $2)
       on conflict (created_by, idem_key) do nothing
       returning id`,
      [idem_key, created_by]
    );
    return result.rows[0] || null;
  },

  async createItems(orderId, ids, qtys, db = pool) {
    await db.query(
      `insert into order_items (order_id, product_id, quantity, unit_price)
       select $1, p.id, v.qty, p.price
       from unnest($2::uuid[], $3::int[]) as v(id, qty)
       join products p on p.id = v.id`,
      [orderId, ids, qtys]
    );
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

  async findOrder({ orderId, userId }) {
    const result = await pool.query(
      `select * from orders where id=$1 and created_by=$2`,
      [orderId, userId]
    );

    return result.rows[0] || null;
  },

  async customFind(orderId, userId) {
    const result = await pool.query(
      `select * from orders where id= $1 and created_by = $2`,
      [orderId, userId]
    );

    return result.rows[0] || null;
  },

  async findPendingOrders() {
    const result = await pool.query(
      `select * from orders  where status = 'pending' and created_at <= now() - interval '15 minutes'`
    );

    return result.rows;
  },

  async findByIdemKey(idemKey, userId, db = pool) {
    const result = await db.query(
      `select id, status, created_at
       from orders where idem_key = $1 and created_by = $2`,
      [idemKey, userId]
    );
    return result.rows[0] || null;
  },

  async findItems(orderId, db = pool) {
    const result = await db.query(
      `select product_id as id, quantity from order_items where order_id = $1`,
      [orderId]
    );

    return result.rows;
  },

  async confirm(orderId, db = pool) {
    const result = await db.query(
      `update orders set status = 'confirmed' where id = $1 returning status`,
      [orderId]
    );

    return result.rows[0];
  },

  async cancelIfPending(orderId, db = pool) {
    const result = await db.query(
      `update orders set status = 'cancelled'
       where id = $1 and status = 'pending'
       returning id, status, created_at`,
      [orderId]
    );
    return result.rows[0] || null;
  },

  async cancel(orderId, db = pool) {
    const result = await db.query(
      `update orders set status = 'cancelled' where id=$1 returning status`,
      [orderId]
    );

    return result.rows[0];
  }
}
