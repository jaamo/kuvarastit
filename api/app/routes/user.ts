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
router.get("/", async (req: express.Request, res: express.Response) => {
  // Get all users.
  const users: Array<any> = await req.app.locals.db.user.findAll({
    attributes: ["name"]
  });

  // VAMOS!
  res.end(JSON.stringify(users));
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
  async (req: express.Request, res: express.Response, next: Function) => {
    // Validate parameters.
    const error: any = validateInput(["email", "password"], req.body);

    // Ooops! Params missing.
    if (error) {
      res
        .status(500)
        .send(
          JSON.stringify({ code: "LOGIN_FAILED", message: "Login failed" })
        );
    }

    // Get user by email.
    const user: any = await req.app.locals.db.user
      .findOne({
        where: { email: req.body.email }
      })
      .catch((err: Error) => {});

    // No user, bail out.
    if (!user) {
      res
        .status(500)
        .send(
          JSON.stringify({ code: "LOGIN_FAILED", message: "Login failed" })
        );
    }

    // Check if passwords match.
    const match: boolean = await bcrypt
      .compare(req.body.password, user.get("password"))
      .catch((err: Error) => {});

    // Success or not success.
    if (match) {
      // Generate token.
      const token: string = uuidv1();

      // Update token to user.
      await req.app.locals.db.user
        .update(
          { token: token },
          {
            where: {
              id: user.get("id")
            }
          }
        )
        .catch((err: Error) => {});

      // Output token.
      res.end(JSON.stringify({ token: token }));
    } else {
      res
        .status(500)
        .send(
          JSON.stringify({ code: "LOGIN_FAILED", message: "Login failed" })
        );
    }
  }
);

module.exports = router;
