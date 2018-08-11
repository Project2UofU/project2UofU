require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var passport = require('passport');
var FaceBookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/config/config.json")[env];
var FACEBOOK_CLIENT_ID = config.facebook.client_id;
var FACEBOOK_CLIENT_SECRET = config.facebook.client_secret;
var GOOGLE_CLIENT_ID = config.google.client_id;
var GOOGLE_CLIENT_SECRET = config.google.client_secret;
var db = require("./models");
var moment = require("moment");


var app = express();
var PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));


// FB login
passport.use(new FaceBookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    console.log(user);
    return cb(err, user);
  });
}
));

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/"
},
function(token, tokenSecret, profile, done) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    console.log(user);
    return cb(err, user);
  });
}
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Routes
var apiRouter = express.Router();
app.use("/api", apiRouter);

require("./routes/apiRoutes")(apiRouter);
require("./routes/htmlRoutes")(app, passport);


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
            db.CompetitionEntry.create({ value: "351", date: moment().toDate(), competitionId: competition.id, userId: michael.id }),
            db.CompetitionEntry.create({ value: "741", date: moment().add(400, 'seconds').toDate(), competitionId: competition.id, userId: thomas.id }),
            db.CompetitionEntry.create({ value: "61", date: moment().add(3910, 'seconds').toDate(), competitionId: competition.id, userId: michael.id }),
            db.CompetitionEntry.create({ value: "124", date: moment().add(8350, 'seconds').toDate(), competitionId: competition.id, userId: daniel.id }),
            db.CompetitionEntry.create({ value: "714", date: moment().add(10200, 'seconds').toDate(), competitionId: competition.id, userId: daniel.id }),
            db.CompetitionEntry.create({ value: "238", date: moment().add(20020, 'seconds').toDate(), competitionId: competition.id, userId: thomas.id })
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
