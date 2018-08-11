var path = require("path");
// var db = require(path.join(__dirname, "../models"));
var publicPath = __dirname + "/../public/views";

module.exports = function (app, passport) {
  // Load index page
  app.get("/", function (req, res) {
    res.sendFile(path.join(publicPath, "index.html"));
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
    passport.authenticate("google", 
    function (err, profile, info) {
      console.log("PROFILE!!!: " + profile);
      // res.redirect("/");
    }));

  

  // app.get('/auth/facebook', passport.authenticate('facebook'));

  // app.get('/auth/provider/callback',
  //   passport.authenticate('provider', {
  //     successRedirect: '/',
  //     failureRedirect: '/login'
  //   }));
  app.get("/signup", function (req, res) {
    res.sendFile(path.join(publicPath, "signup.html"));
  });
};