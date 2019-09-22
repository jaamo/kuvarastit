import express = require("express");
const router: express.Router = require("express").Router();

router.get("/", function(req: express.Request, res: express.Response) {
  res.end(JSON.stringify({ status: "ok" }));
});

module.exports = router;
