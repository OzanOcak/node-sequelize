const User = require("./User");
const UserNotFoundException = require("./UserNotFoundException");
const bcrypt = require("bcrypt");

const create = async (body) => {
  const { username, email, password } = body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashedPassword });
};

const getUsers = async (pagination) => {
  const { page, size } = pagination;

  const usersWithCount = await User.findAndCountAll({
    limit: size,
    offset: page * size,
    attributes: ["id", "username", "email"], // to return attributes from object
  });
  return {
    content: usersWithCount.rows,
    /*content: usersWithCount.rows.map((user) => {
      const userAsJSON = user.get();
      delete user.password;
      return userAsJSON;
    }),*/
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size)),
  };
};

const getUser = async (id) => {
  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    throw new UserNotFoundException();
  }
  return user;
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email: email } });
};

module.exports = {
  create,
  getUsers,
  getUser,
  findByEmail,
};
