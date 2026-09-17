const { createClient } = require('redis');
const { REDIS_URL } = require('./env');

const redisClient = createClient({
	url: REDIS_URL,
	socket: {
		connectTimeout: 5000,
		reconnectStrategy: false,
	},
});

redisClient.on('error', (err) => {
	console.log(`❌ Unexpected error on Redis client: ${err.message}`);
});

module.exports.connectRedis = async () => {
	const maxAttempts = 3;
	let attempt = 0;

	while (attempt < maxAttempts) {
		try {
			attempt++;
			await redisClient.connect();
			console.log(`✅ Connected to Redis. attempt: #${attempt}`);
			return;
		} catch (error) {
			console.log(`ℹ️ Redis connection attempt #${attempt} failed: ${error.message}`);

			if (attempt >= maxAttempts) {
				console.log(`❌ Cannot connect to Redis after ${maxAttempts} attempts. Shutting down...`);
				process.exit(1);
			}

			await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
		}
	}
};

module.exports.redisClient = redisClient;
