// lib/app.ts
import express = require("express");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

// Bcrypt setting.
const saltRounds = 10;

// DB
const sequelize = new Sequelize(
  "postgres://postgres:kuvarastit@127.0.0.1:5432/postgres"
);

// Create a new express application instance
const app: express.Application = express();

// Defaults.
app.use(function(req: express.Request, res: express.Response, next: Function) {
  res.setHeader("Content-Type", "application/json");
  next();
});

// User model.
const User = sequelize.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    }
  },
  {
    // options
  }
);

function requiresLogin(
  req: express.Request,
  res: express.Response,
  next: Function
) {
  const err: any = new Error("You must be logged in to view this page.");
  err.status = 401;
  err.customCode = "AUTHORIZATION_REQUIRED";

  const token = req.query.token;

  // Error if token not set.
  if (!token) {
    return next(err);
  }

  // Try to find user with token.
  User.findOne({ where: { token: token } }).then((user: any) => {
    if (user) {
      res.locals.user = user;
      return next();
    } else {
      return next(err);
    }
  });
}

app.get("/init", function(req, res) {
  User.sync({ force: true }).then(() => {
    // Now the `users` table in the database corresponds to the model definition

    return bcrypt.hash("kukkuu", saltRounds, function(err: any, hash: string) {
      User.create({
        email: "jaakko@alajoki.fi",
        name: "kampiapina",
        password: hash,
        token: "lollero"
      });
      User.create({
        email: "petteri@testi.fi",
        name: "petteri",
        password: hash
      });
      return User.create({
        email: "jalmari@testi.fi",
        name: "jalmari",
        password: hash
      });
    });
  });

  res.send("Init ok");
});

app.get("/", function(req: express.Request, res: express.Response) {
  res.end(JSON.stringify({ status: "ok" }));
});

/**
 * Display information about the profile.
 */
app.get("/me", requiresLogin, function(
  req: express.Request,
  res: express.Response
) {
  res.end(JSON.stringify(res.locals.user));
});

/**
 * Get list of all users.
 */
app.get("/user", function(req: express.Request, res: express.Response) {
  // Find all users.
  User.findAll({
    attributes: ["name"]
  }).then((users: Array<any>) => {
    res.end(JSON.stringify(users));
  });
});

/**
 * Error handler. Return proper error code and more information as JSON format.
 */
app.use(function(
  err: any,
  req: express.Request,
  res: express.Response,
  next: Function
) {
  console.error(err.stack);
  res
    .status(err.status)
    .send(JSON.stringify({ code: err.customCode, message: err.message }));
});

/**
 * Start the server.
 */
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
