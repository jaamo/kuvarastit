import express = require("express");

module.exports = function(
  err: any,
  req: express.Request,
  res: express.Response,
  next: Function
) {
  console.error(err.stack);
  res
    .status(err.status)
    .send(JSON.stringify({ code: err.customCode, message: err.message }));
};
