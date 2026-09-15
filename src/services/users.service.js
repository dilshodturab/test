const bcrypt = require("bcryptjs");
const usersRepository = require("../repositories/users.repository");
const  jwt = require("jsonwebtoken");
const { SECRET } = require("../config/env");
const { CustomThrowError } = require("../config/custom-errors");

const generateToken = (user) => {
	return jwt.sign( { id: user.id }, SECRET, { expiresIn: '50m' } );
};

module.exports.register = async (data) => {
  const existing = await usersRepository.findByUsername(data.username);
  if (existing) {
		throw new CustomThrowError("Username already exists", 409);
	}

  const userData = {
    username: data.username,
		password: await bcrypt.hash(data.password, 10),
	}
	const user = await usersRepository.createUser(userData);

	return { user, token: generateToken(user) };
};
