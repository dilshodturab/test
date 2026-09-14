module.exports.ENV = process.env.NODE_ENV || "development";
module.exports.PORT = process.env.PORT || 3000;
module.exports.DB_URL = process.env.DB_URL || "postgres://do:1234@localhost:5432/pgdbfortest";
module.exports.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
module.exports.SECRET = process.env.SECRET || "development-secret";
