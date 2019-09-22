import express = require("express");

/**
 * Middleware function to check if user is logged in.
 */
module.exports = function requiresLogin(
  req: express.Request,
  res: express.Response,
  next: Function
) {
  // Create error object.
  const err: any = new Error("You must be logged in to view this page.");
  err.status = 401;
  err.customCode = "AUTHORIZATION_REQUIRED";

  // Extract token from url params.
  const token = req.query.token;

  // Error if token not set.
  if (!token) {
    return next(err);
  }

  // Try to find user with token.
  req.app.locals.db.user
    .findOne({ where: { token: token } })
    .then((user: any) => {
      if (user) {
        res.locals.user = user;
        return next();
      } else {
        return next(err);
      }
    });
};
