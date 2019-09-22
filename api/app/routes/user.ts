import express = require("express");
const router: express.Router = require("express").Router();

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

module.exports = router;
