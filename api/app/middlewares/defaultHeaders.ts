import express = require("express");

module.exports = function(
  req: express.Request,
  res: express.Response,
  next: Function
) {
  res.setHeader("Content-Type", "application/json");
  next();
};
