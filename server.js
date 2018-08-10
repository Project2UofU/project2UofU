require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public/")));

var apiRouter = express.Router();
app.use("/api", apiRouter);

// Routes
require("./routes/apiRoutes")(apiRouter);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

const seed = () => {
  return Promise.all([
    db.User.create({ name: "Michael", password: "blue" }),
    db.User.create({ name: "Thomas", password: "red" }),
    db.User.create({ name: "Daniel", password: "yellow" }),
  ])
    .then(result => {
      const michael = result[0];
      const thomas = result[1];
      const daniel = result[2];
      return Promise.all([
        db.Competition.create({ title: "Weight Loss", ownerId: michael.id })
      ])
        .then(result => {
          const competition = result[0];
          return Promise.all([
            db.UserCompetition.create({ competitionId: competition.id, participantId: michael.id }),
            db.UserCompetition.create({ competitionId: competition.id, participantId: thomas.id }),
            db.UserCompetition.create({ competitionId: competition.id, participantId: daniel.id }),
            db.CompetitionEntry.create({ value: "351", competitionId: competition.id, userId: michael.id }),
            db.CompetitionEntry.create({ value: "741", competitionId: competition.id, userId: thomas.id }),
            db.CompetitionEntry.create({ value: "61", competitionId: competition.id, userId: michael.id }),
            db.CompetitionEntry.create({ value: "124", competitionId: competition.id, userId: daniel.id }),
            db.CompetitionEntry.create({ value: "714", competitionId: competition.id, userId: daniel.id }),
            db.CompetitionEntry.create({ value: "238", competitionId: competition.id, userId: thomas.id })
          ])
        })
    }).catch(function (err) {
      console.log("Error: " + err);
    });
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, function () {
      console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
      );
    });
  }
}).then(() => {
  if (process.env.NODE_ENV === "test") {
    // Populate with test data
    seed();
  }
});

module.exports = app;
