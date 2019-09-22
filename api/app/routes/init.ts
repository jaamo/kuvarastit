import express = require("express");
const bcrypt = require("bcrypt");
const router: express.Router = require("express").Router();

// Bcrypt setting.
const saltRounds = 10;

router.get("/", function(req: express.Request, res: express.Response) {
  const user = req.app.locals.db.user;
  user.sync({ force: true }).then(() => {
    return bcrypt.hash("kukkuu", saltRounds, function(err: any, hash: string) {
      user.create({
        email: "jaakko@alajoki.fi",
        name: "kampiapina",
        password: hash,
        token: "lollero"
      });
      user.create({
        email: "petteri@testi.fi",
        name: "petteri",
        password: hash
      });
      user.create({
        email: "jalmari@testi.fi",
        name: "jalmariz",
        password: hash
      });
    });
  });

  res.send("Init ok");
});

module.exports = router;
