const { jwt } = require("jsonwebtoken");
const { SECRET } = require("./env");

module.exports.auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
			return res.status(401).json({success: false, message: "Unauthorized - missing or invalid authentication credentials"});
		}

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

  } catch (error) { next(error) }
}
