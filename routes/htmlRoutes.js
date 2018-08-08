var path = require("path");
var db = require(path.join(__dirname, "../models"));

module.exports = function (app, passport) {
  // Load index page
  app.get("/", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.Example.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.get('/login',
    function (req, res) {
      res.render('login');
    });

  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get('/login/facebook',
    passport.authenticate('facebook'));

  app.get('/login/facebook/return',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }),
    function (req, res) {
      res.redirect('/');
    });

  app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      res.render('profile', {
        user: req.user
      });
    });

  app.get('/auth/google',
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/plus.login']
    }));


  app.get("/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login"
    }),
    function (req, res) {
      res.redirect("/");
    });

  app.get("/hi", function (req, res) {
    res.send("text");
  });

  // app.get('/auth/facebook', passport.authenticate('facebook'));

  // app.get('/auth/provider/callback',
  //   passport.authenticate('provider', {
  //     successRedirect: '/',
  //     failureRedirect: '/login'
  //   }));
};