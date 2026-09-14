const { pool } = require("../config/db-connect")

module.exports.seedTables = async () => {
  try {
    await pool.query(`create extension if not exists "pgcrypto";`);
    await pool.query(`
          DO $$ BEGIN
            create type order_status as enum ('pending', 'confirmed', 'cancelled');
          EXCEPTION
            when duplicate_object then null;
          END $$;
        `);
    await pool.query(`
      create table if not exists users (
        id uuid primary key default gen_random_uuid(),
        username varchar(50) not null unique,
        email varchar(100) not null unique,
        password varchar(255) not null,
        created_at timestamp default current_timestamp
        );

      create table if not exists products (
        id uuid primary key default gen_random_uuid(),
        name varchar(100) not null unique,
        price numeric(10, 2) not null,
        stock_quantity int not null default 0
      );

      create table if not exists orders (
        id uuid primary key default gen_random_uuid(),
        status order_status not null default 'pending',
        idem_key varchar(255),
        products uuid[] default '{}'
      );
      `);
    console.log("Yo twin all of your tables are seeded.");
  } catch (error) {
    console.log("Error table seeding: ", error);
  }
}
