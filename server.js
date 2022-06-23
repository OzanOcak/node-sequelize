const sequelize = require("./src/config/database");
const app = require("./src/app");
const UserService = require("./src/user/UserService");

//.then is to create 5 user for db

sequelize.sync({ force: true }).then(async () => {
  for (let i = 1; i <= 5; i++) {
    const user = {
      username: `user${i}`,
      email: `user${i}@mail.com`,
      password: "P4ssword",
    };
    await UserService.create(user);
  }
});

app.listen(3000, () => {
  console.log("app is running");
});
