var path = require("path");
var sequelize = require("sequelize");
var db = require(path.join(__dirname, "../models"));
var request = require('request');

// /api/user/*
module.exports = function (app) {

    // app.post("/addEntry", function (req, res) {
    //     if (!req.body.competitionId) {
    //         return res.status(400).json({ error: "Missing competitionId" });
    //     } else if (!req.body.userId) {
    //         return res.status(400).json({ error: "Missing userId" });
    //     } else if (!req.body.value) {
    //         return res.status(400).json({ error: "Missing value" });
    //     }
    app.post("/addDummyData", function (req, res) {
        request.post('http://localhost:3000/api/user/create', {
            json: {
                name: 'Michael Daniels',
                password: "test"
            }
        }, function (error, response, user) {
            request.post('http://localhost:3000/api/competition/create', {
                json: {
                    title: "Weight Loss",
                    ownerId: user.id
                }
            }, function (error, response, competition) {
                console.log(competition);
                request.post('http://localhost:3000/api/competition/addEntry', {
                    json: {
                        userId: user.id,
                        competitionId: competition.id,
                        value:"test"
                    }
                }, function (error, response, entry) {
                    res.json(entry);
                });
            });
        });
    });

    app.post("/create", function (req, res) {
        var body = req.body;
        var name = body.name.trim();
        var password = body.password; // TODO: Validate and Encrypt the password
        if (!name) {
            return res.status(400).json({ error: "Missing name" });
        } else if (name.length == 0) {
            return res.status(400).json({ error: "Name must container at least 1 character" });
        } else if (name.length > 50) {
            return res.status(400).json({ error: "Name must be less than 50 characters" });
        }

        var params = {
            name: name,
            password: password
        }
        db.User.create(params).then(function (dbUser) {
            res.json(dbUser);
        }).catch(function (err) {
            res.send(err);
        });
    });


    // Get Competitions with the participant count
    app.get("/competitions", function (req, res) {
        var ownerId = req.query.ownerId
        if (!ownerId) {
            return res.status(400).json({ error: "Missing ownerId" });
        }


        // Get all competitions
        //   - Get all users in a competition
        // on competition you have an owner it wokrs not you have participants 
        db.Competition.findAll({
            where: { ownerId: ownerId },
            attributes: ['id', 'title', 'createdAt'],
            include: [{
                model: db.UserCompetition,
                include: [{
                    model: db.User,
                    as: 'participant',
                    attributes: ['id', 'name']
                }]
                // as: "competition",
                // attributes: [sequelize.fn('COUNT', sequelize.col('userId')), 'hello']
            }]
            //[[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
        }).then(function (dbCompetition) {
            res.json(dbCompetition);
        });

    });

};
