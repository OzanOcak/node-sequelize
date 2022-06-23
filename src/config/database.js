const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("test-db", "admin", "psswd", {
  dialect: "sqlite",
  host: "./dev.sqlite",
});

module.exports = sequelize;
