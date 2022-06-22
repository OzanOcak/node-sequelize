const express = require("express");
const sequelize = require("./database");
const User = require("./User");

sequelize
  .sync({ force: true })
  .then(() => console.log("connected to the database"));
//force true update db and we can see modifications in the code
const app = express();

app.use(express.json());

app.post("/users", (req, res) => {
  User.create(req.body).then(() => {
    res.send("user is inserted");
  });
});

app.listen(3000, () => {
  console.log("app is running");
});
