var path = require("path");
// var db = require(path.join(__dirname, "../models"));
var publicPath = __dirname + "/../public/views";

module.exports = function (app, passport) {
  // Load index page
  app.get("/", function (req, res) {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  app.get("/competitionentry", function (req, res) {
    res.sendFile(path.join(publicPath, "competition_entry.html"));
  });

  app.get("/competition", function (req, res) {
    res.sendFile(path.join(publicPath, "competition.html"));
  });

  app.get("/signup", function (req, res) {
    res.sendFile(path.join(publicPath, "signup.html"));
  });

  app.get("/competitions", function (req, res) {
    res.sendFile(path.join(publicPath, "list_of_competitions.html"));
  })
};