var path = require("path");
var sequelize = require("sequelize");
var db = require(path.join(__dirname, "../models"));

// /api/user/*
module.exports = function (app) {

    app.post("/create", function (req, res) {
        var body = req.body;
        var username = body.username.trim();
        var password = body.password; // TODO: Validate and Encrypt the password
        if (!username) {
            return res.status(400).json({
                error: "Missing username"
            });
        } else if (username.length == 0) {
            return res.status(400).json({
                error: "Username must container at least 1 character"
            });
        } else if (Username.length > 50) {
            return res.status(400).json({
                error: "Username must be less than 50 characters"
            });
        }

        var params = {
            username: username,
            password: password
        }
        db.User.create(params).then(function (dbUser) {
            res.json(dbUser.get());
        }).catch(function (err) {
            res.send(err);
        });
    });

    // Example:
    // {
    //     "competitions": [
    //       {
    //         "title": "Weight Loss",
    //         "id": "49d5bccc-fd94-4f76-a8c5-8d0afe756618",
    //         "participantCount": 3
    //       }
    //     ]
    //   }

    // URL: api/user/competitions
    // Method: GET
    // Description: Get Competitions with the participant count
    // Parameters: 
    // - ownerId: String
    app.get("/login", function (req, res) {
        var username = req.query.username;
        if (!username) {
            return res.status(400).json({
                error: "Missing username"
            });
        }
        var password = req.query.password;
        if (!password) {
            return res.status(400).json({
                error: "Missing password"
            });
        }
        db.User.findOne({
            where: {
                username: username,
                password: password
            }
        }).then(function (dbUser) {
            res.json(dbUser.get());

        }).catch(function (err) {
            res.send(err);
        });
    });

    app.get("/competitions", function (req, res) {
        var ownerId = req.query.ownerId;
        if (!ownerId) {
            return res.status(400).json({
                error: "Missing ownerId"
            });
        }

        return db.Competition.findAll({
            where: {
                ownerId: ownerId
            },
            attributes: ['id', 'title', 'createdAt', 'updatedAt', [sequelize.fn('COUNT', sequelize.col('competitions.id')), 'participantCount']],
            include: [{
                as: "competitions",
                model: db.UserCompetition,
                attributes: ["id"],
                include: {
                    model: db.User,
                    as: "participant",
                    attributes: ["username", "id"],
                }
            }]
        }).then(function (competitions) {
            var competitionsArray = [];
            competitions.forEach(competition => {
                if (competition.id === null) {
                    // TODO: Look into an issue where this can return an object with null values if it doesn't exist
                    return;
                }

                var competition = competition.get();
                var competitionObject = {
                    title: competition.title,
                    id: competition.id
                }
                if (competition.participantCount) {
                    competitionObject.participantCount = competition.participantCount
                }

                competitionsArray.push(competitionObject);
            })

            res.json({
                "competitions": competitionsArray
            });
        }).catch(function (err) {
            res.send(err);
        });

    });

};