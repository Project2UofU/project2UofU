var path = require("path");
// var db = require(path.join(__dirname, "../models"));
var publicPath = __dirname + "/../public/views";

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.sendFile(path.join(publicPath, "index.html"));
  });
  app.get("/public/views  ", function (req, res) {
    res.sendFile(path.join(publicPath, "signupform.html"));
  });
};