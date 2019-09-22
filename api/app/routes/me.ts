import express = require("express");
const router: express.Router = require("express").Router();
const requiresLogin: any = require("../middlewares/requiresLogin");

/**
 * Display information about the profile.
 */
router.get("/", requiresLogin, function(
  req: express.Request,
  res: express.Response
) {
  res.end(JSON.stringify(res.locals.user));
});

module.exports = router;
