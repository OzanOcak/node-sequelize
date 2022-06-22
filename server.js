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

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ where: { id: id } });
  res.send(user);
});

app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ where: { id: id } });
  user.username = req.body.username;
  await user.save();
  res.send("updated");
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  await User.destroy({ where: { id: id } });
  res.send("removed");
});

app.listen(3000, () => {
  console.log("app is running");
});
