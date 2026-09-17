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
  if (existing) { throw new CustomThrowError("Username already exists", 409) }

  const userData = {
    username: data.username,
		password: await bcrypt.hash(data.password, 10),
	}
	const user = await usersRepository.createUser(userData);

	return generateToken(user);
};

module.exports.login = async (data) => {
  const user = await usersRepository.findByUsername(data.username);
  if (!user) { throw new CustomThrowError("Invalid username or password", 401) }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) { throw new CustomThrowError("Invalid username or password", 401) }

  return generateToken(user);
}
