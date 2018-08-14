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
        } else if (username.length > 50) {
            return res.status(400).json({
                error: "Username must be less than 50 characters"
            });
        }

        var params = {
            username: username,
            password: password
        }
        db.User.create(params).then(function (dbUser) {
            res.json( {user: dbUser.get()} );
        }).catch(function (err) {
            res.send(err);
        });
    });

    app.get("/login", function (req, res) {
        console.log("\r\r hit route \r\r")
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
            if (!dbUser) {
                return res.status(400).json({
                    error: "No user found with the given username/password"
                });
            }

            res.status(200).json({
                user: {
                    username: dbUser.username,
                    id: dbUser.id
                }
            });

        }).catch(function (err) {
            res.send(err);
        });
    });

    // URL: api/user/competitions
    // Method: GET
    // Description: Get Competitions with the participant count
    // Parameters: 
    // - ownerId: String
    // TODO: Update to grab based of participant id and not owner id
    app.get("/competitions", function (req, res) {
        var userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({
                error: "Missing ownerId"
            });
        }

        //TODO
        // return db.Competition.findAll({
        //     where: {
        //         ownerId: ownerId
        //     },
        //     attributes: ['id', 'title', 'createdAt', 'updatedAt', [sequelize.fn('COUNT', sequelize.col('competitions.id')), 'participantCount']],
        //     include: [{
        //         as: "competitions",
        //         model: db.UserCompetition,
        //         attributes: ["id"],
        //         include: {
        //             model: db.User,
        //             as: "participant",
        //             attributes: ["username", "id"],
        //         }
        //     }]

        return db.UserCompetition.findAll({
            where: {
                participantId: userId
            },
            attributes: ['participantId', 'competitionId'],
            include: [{
                as: "competition",
                model: db.Competition,
                attributes: ['id', 'title', 'createdAt', 'updatedAt'],
                include: {
                    as: "competitions",
                    model: db.UserCompetition,
                    attributes: ["id"]
                }
            }]
        }).then(function (usercompetition) {
            console.log(JSON.stringify(usercompetition, 0, 2));
            var competitionsArray = [];
            usercompetition.forEach(usercompetition => {
                var competition = usercompetition.competition;
                if (competition.id === null) {
                    // TODO: Look into an issue where this can return an object with null values if it doesn't exist
                    return;
                }

                var competition = competition.get();
                var competitionObject = {
                    title: competition.title,
                    id: competition.id
                }
                if (competition.competitions) {
                    competitionObject.participantCount = competition.competitions.length; // TODO: Update to use a count function
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
