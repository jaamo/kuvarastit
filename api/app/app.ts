import express = require("express");
const bodyParser = require("body-parser");
const Db = require("./db");
const defaultHeaders: any = require("./middlewares/defaultHeaders");
const errorHandler: any = require("./middlewares/errorHandler");

// Create a new express application instance
const app: express.Application = express();

// Init database
app.locals.db = new Db();

// Apply default JSON headers.
app.use(defaultHeaders);

// Parse forms.
app.use(bodyParser.urlencoded({ extended: true }));

// Routes.
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/user"));
app.use("/me", require("./routes/me"));
app.use("/init", require("./routes/init"));

// Handle errors.
app.use(errorHandler);

// Start the server.
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
