const { pool } = require("../config/db-connect");

module.exports = {
  async create(data, db = pool) {
    const result = await db.query(
      `insert into products (name, price, stock_quantity) values ($1, $2, $3) returning id, name`,
      [data.name, data.price, data.stock_quantity]
    );

    return result.rows[0];
  },

  async all() {
    const result = await pool.query(
      `select * from products`
    );

    return result.rows;
  },

  async findBy(key, value) {
    const result = await pool.query(
      `select * from products where ${key} = $1`,
      [value]
    );

    return result.rows[0] || null;
  },

  async subtractOneById(id, db = pool) {
    const result = await db.query(
      `update products set stock_quantity = stock_quantity-1 where id = $1 returning id, stock_quantity`,
      [id]
    );

    return result.rows[0];
  },

  async restoreStockQty(id, db = pool) {
    const result = await db.query(
      `update products set stock_quantity = stock_quantity+1 where id = $1 returning id, stock_quantity`,
      [id]
    );

    return result.rows[0];
  },

  async lockByIds(ids, db = pool) {
    const result = await db.query(
      `select id, stock_quantity from products
       where id = any($1::uuid[])
       order by id
       for update`,
      [ids]
    );
    return result.rows;
  },

  async subtractMany(ids, qtys, db = pool) {
    await db.query(
      `update products p
       set stock_quantity = p.stock_quantity - v.qty
       from unnest($1::uuid[], $2::int[]) as v(id, qty)
       where p.id = v.id`,
      [ids, qtys]
    );
  },

  async restoreMany(ids, qtys, db = pool) {
    await db.query(
      `update products p
       set stock_quantity = p.stock_quantity + v.qty
       from unnest($1::uuid[], $2::int[]) as v(id, qty)
       where p.id = v.id`,
      [ids, qtys]
    );
  },
}
