const jwt = require("jsonwebtoken");
const { SECRET } = require("./env");
const { findById } = require("../repositories/users.repository");
const { CustomThrowError } = require("./custom-errors");

module.exports.auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
			return res.status(401).json({success: false, message: "Unauthorized - missing or invalid authentication credentials"});
		}

    const token = header.split(" ")[1];
    if (!token) {
      throw new CustomThrowError("Unauthorized - missing token", 401);
    }
    const decoded = jwt.verify(token, SECRET);

    const user = await findById(decoded.id);
    if(!user) {throw new CustomThrowError("Unauthorized - user not found", 401)}

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid or expired token" });
    }
    next(error)
  }
}
