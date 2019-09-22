import express = require("express");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const router: express.Router = require("express").Router();
const validateInput = require("../helpers/validateInput");
const uuidv1 = require("uuid/v1");

const saltRounds = 10;

/**
 * Get list of all users.
 */
router.get("/", function(req: express.Request, res: express.Response) {
  // Find all users.
  req.app.locals.db.user
    .findAll({
      attributes: ["name"]
    })
    .then((users: Array<any>) => {
      res.end(JSON.stringify(users));
    });
});

/**
 * Create user.
 */
router.post("/", function(
  req: express.Request,
  res: express.Response,
  next: Function
) {
  // Validate parameters.
  const error: any = validateInput(["email", "name", "password"], req.body);

  // Ooops! Params missing.
  if (error) {
    throw error;
  }

  // Try to find user with email address.
  req.app.locals.db.user
    .findOne({
      where: {
        [Sequelize.Op.or]: { email: req.body.email, name: req.body.name }
      }
    })
    .then((user: any) => {
      if (!user) {
        // Hash password.
        const user = req.app.locals.db.user;
        bcrypt.hash(req.body.password, saltRounds, (err: any, hash: string) => {
          // Add user.
          user
            .create({
              email: req.body.email,
              name: req.body.name,
              password: hash
            })
            .then((user: any) => {
              res.end(JSON.stringify(user));
            })
            .catch((err: any) => {
              const err2: any = new Error(err.message);
              err2.status = 500;
              err2.customCode = "FAILED";
              next(err2);
            });
        });
      } else {
        const err: any = new Error("Email or name not unique.");
        err.status = 500;
        err.customCode = "NOT_UNIQUE";
        next(err);
      }
    });
});

/**
 * Login.
 */
router.post(
  "/login",
  (req: express.Request, res: express.Response, next: Function) => {
    // Validate parameters.
    const error: any = validateInput(["email", "password"], req.body);

    // Ooops! Params missing.
    if (error) {
      throw error;
    }

    // Error.
    const err: any = new Error("Login failed.");
    err.status = 401;
    err.customCode = "LOGIN_FAILED";

    // Load user with given email.
    req.app.locals.db.user
      .findOne({ where: { email: req.body.email } })
      .then((user: any) => {
        console.log("user löyty");
        // User found. Check password.
        if (user) {
          // Check matching password.
          bcrypt
            .compare(req.body.password, user.get("password"))
            .then(function(result: boolean) {
              console.log("hässi verratttu");
              // Login successful.
              if (result) {
                console.log("juu");
                const uuid: string = uuidv1();
                res.end(JSON.stringify({ token: uuid }));
              }
              // Login failed.
              else {
                console.log("ei");
                res.status(401).send(
                  JSON.stringify({
                    code: "LOGIN_FAILED",
                    message: "Login failed"
                  })
                );
              }
            });
        }
      });
  }
);

module.exports = router;
