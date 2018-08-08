var path = require("path");
// var db = require(path.join(__dirname, "../models"));
var publicPath = __dirname + "/../public/views";

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.sendFile(path.join(publicPath, "index.html"));
  });
  app.get("/sign-up", function (req, res) {
    res.sendFile(path.join(publicPath, "signup.html"));
  });
  // app.get("/user-home", function (req, res) {
  //   res.sendFile(path.join(publicPath, ""));
  // });
  app.get("/user/competitions", function(req, res) {
    res.sendFile(path.join(publicPath, ""));
  });
};