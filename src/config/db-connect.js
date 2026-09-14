const { Pool } = require('pg');
const { DB_URL } = require('./env');

const pool = new Pool({
	connectionString: DB_URL,
});

pool.on('error', (err) => {
	console.log(`❌ Unexpected error on idle client: ${err.message}`);
});

module.exports.connectDB = async (app) => {
	const maxAttempts = 3;
	let attempt = 0;

	while (attempt < maxAttempts) {
		try {
			attempt++;
			const client = await pool.connect();
			client.release();
			console.log(`✅ Connected to DB. attempt: #${attempt}`);
			return app;
		} catch (error) {
			console.log(`ℹ️ DB connection attempt #${attempt} failed: ${error.message}`);

			if (attempt >= maxAttempts) {
				console.log(`❌ Cannot connect to DB after ${maxAttempts} attempts. Shutting down...`);
				process.exit(1);
			}

			await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
		}
	}
};

module.exports.pool = pool;
