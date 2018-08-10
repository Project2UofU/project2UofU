var path = require("path");
var db = require(path.join(__dirname, "../models"));
var express = require("express");

var userRouter = express.Router();
var competitionRouter = express.Router();
require("./userRoutes")(userRouter);
require("./competitionRoutes")(competitionRouter);

// /api/*
module.exports = function (app) {

  app.use("/user", userRouter);
  app.use("/competition", competitionRouter);

};
