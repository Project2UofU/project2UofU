require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var path = require("path");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public/")));


app.set('views', path.join(__dirname, '/views/'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main', 
  extname: '.handlebars',
  layoutsDir: path.join(__dirname, '/views/layouts/'),
  partialsDir: path.join(__dirname, '/views/partials/')
}));
app.set("view engine", "handlebars");


var apiRouter = express.Router();
app.use("/api", apiRouter);

// Routes
require("./routes/apiRoutes")(apiRouter);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: true }; // TODO: Change to false

// If running a test, set syncOptions.force to true
// clearing the `testdb`
// if (process.env.NODE_ENV === "test") { // TODO: Add this line back in
if (process.env.NODE_ENV !== "production") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, function() {
      console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
      );
    });
  }
});

module.exports = app;
