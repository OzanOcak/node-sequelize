const express = require("express");
const sequelize = require("./database");
const User = require("./User");
const Article = require("./Article");

sequelize.sync({ force: true }).then(async () => {
  for (let i = 1; i <= 25; i++) {
    const user = {
      username: `user${i}`,
      email: `user${i}@mail.com`,
      password: "P4ssword",
    };
    await User.create(user);
    const article = {
      content: `article content ${i}`,
    };
    await Article.create(article);
  }
});
//force true update db and we can see modifications in the code
const app = express();

app.use(express.json());

/** this is the use case of middleware
 * a sample of next which will run in every request
 */

const thisWillRunInEveryRequest = (req, res, next) => {
  console.log("running the middleware for", req.method, req.originalUrl);
  next();
};

app.use(thisWillRunInEveryRequest);

/** --------------------- */

app.post("/users", async (req, res) => {
  await User.create(req.body).then(() => {
    res.send("user is inserted");
  });
});

/** we can separate pagination and call it as
 * a middleware
 */
const pagination = (req, res, next) => {
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  let size = 10;
  if (
    !Number.isNaN(sizeAsNumber) &&
    !(sizeAsNumber > 10) &&
    !(sizeAsNumber < 1)
  ) {
    size = sizeAsNumber;
  }
  req.pagination = {
    page,
    size,
  };
  next();
};

// the pagination function will be called in app.get

app.get("/users", pagination, async (req, res) => {
  const { page, size } = req.pagination;

  const usersWithCount = await User.findAndCountAll({
    limit: size,
    offset: page * size,
  });
  res.send({
    content: usersWithCount.rows,
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size)),
  });
});

// instead of throwing error we pass the error next function to handle it
// curl http://localhost:3000/users/aa  will return invalid id exception
// with -I flag we can also see 400 Bad Request

app.get("/users/:id", async (req, res, next) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    next(new InvalidIdException());
  }
  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    next(new UserNotFoundException());
  }
  res.send(user);
});

// we can next middleware in other routes

app.get("/articles", pagination, async (req, res) => {
  const { page, size } = req.pagination;

  const articleWithCount = await Article.findAndCountAll({
    limit: size,
    offset: page * size,
  });
  res.send({
    content: articleWithCount.rows,
    totalPages: Math.ceil(articleWithCount.count / Number.parseInt(size)),
  });
});

function InvalidIdException() {
  this.status = 400;
  this.message = "Invalid ID";
}

function UserNotFoundException() {
  this.status = 404;
  this.message = "User not found";
}

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

// app.use is another next function to log errors in console
app.use((err, req, res, next) => {
  res.status(err.status).send({
    message: err.message,
    timestamp: Date.now(),
    path: req.originalUrl,
  });
});

app.listen(3000, () => {
  console.log("app is running");
});
