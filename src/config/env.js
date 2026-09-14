module.exports.DEV = true
module.exports.PORT = 3000;
module.exports.DB_URL = this.DEV ? "postgres://do:1234@localhost:5432/pgdbfortest" : "postgres://do:1234@postgres:5432/pgdbfortest"
module.exports.SECRET = "secret"
