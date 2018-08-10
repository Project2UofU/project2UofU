var path = require("path");
var db = require(path.join(__dirname, "../models"));

// /api/competition/*
module.exports = function (app) {

    app.post("/create", function (req, res) {
        var title = req.body.title;
        var ownerId = req.body.ownerId;
        if (!title) {
            return res.status(400).json({ error: "Missing title" });
        } else if (!ownerId) {
            return res.status(400).json({ error: "Missing ownerId" });
        }

        var competitionParams = {
            title: title,
            ownerId: ownerId
        }

        // TODO: Find a better way to do this
        db.User.findOne({
            where: { id: ownerId }
        }).then(function (dbUser) {
            db.Competition.create(competitionParams).then(function (dbCompetition) {
                var userCompetitionParams = {
                    participantId: dbUser.id,
                    competitionId: dbCompetition.id
                }

                db.UserCompetition.create(userCompetitionParams).then(function (dbUserCompetition) {
                    res.json(dbCompetition);
                }).catch(function (err) {
                    res.send(err);
                });
            }).catch(function (err) {
                res.send(err);
            });
        }).catch(function (err) {
            res.status(400).json({ error: "User with ownerId " + `${req.body.ownerId}` + " does NOT exist" });
        });
    });

    // Example:
    // {
    //     "competitions": [
    //       {
    //         "title": "Weight Loss",
    //         "id": "f4c7300f-edfd-4da0-a15d-6e120595d18e",
    //         "participants": [
    //           {
    //             "name": "Michael",
    //             "id": "2bbd7a0d-7d93-417e-a888-7245b582c483"
    //           },
    //           {
    //             "name": "Thomas",
    //             "id": "a46b948c-3b5f-4703-afcc-352f4f859398"
    //           },
    //           {
    //             "name": "Daniel",
    //             "id": "bc83a0a6-3db4-41ec-84c0-c0433a01b1cf"
    //           }
    //         ]
    //       }
    //     ]
    //   }

    // URL: api/competition/[id]
    // Method: GET
    // Description: Get Competitions with their participants
    app.get("/:id", function (req, res) {
        var id = req.params.id
        if (!id) {
            return res.status(400).json({ error: "Missing competition id" });
        }

        return db.Competition.findOne({
            where: { id: id },
            attributes: ['id', 'title', 'createdAt', 'updatedAt'],
            include: [{
                as: "competitions",
                model: db.UserCompetition,
                attributes: ["id"],
                include: {
                    model: db.User,
                    as: "participant",
                    attributes: ["name", "id"],
                }
            }]
        }).then(function (competition) {
            var competition = competition.get();
            var competitionObject = {
                title: competition.title,
                id: competition.id
            }

            if (competition.participantCount) {
                competitionObject.participantCount = competition.participantCount
            }

            var participants = [];
            competition.competitions.forEach(userCompetition => {
                var userCompetition = userCompetition.get();
                var user = {
                    name: userCompetition.participant.name,
                    id: userCompetition.participant.id
                }

                participants.push(user);
            })

            competitionObject.participants = participants;
            res.json({ "competition": competitionObject });
        }).catch(function (err) {
            res.send(err);
        });

    });

    app.post("/addEntry", function (req, res) {
        if (!req.body.competitionId) {
            return res.status(400).json({ error: "Missing competitionId" });
        } else if (!req.body.userId) {
            return res.status(400).json({ error: "Missing userId" });
        } else if (!req.body.value) {
            return res.status(400).json({ error: "Missing value" });
        }

        db.CompetitionEntry.create({ value: req.body.value, competitionId: req.body.competitionId, userId: req.body.userId }).then(function (dbCompetitionEntry) {
            res.json(dbCompetitionEntry);
        }).catch(function (err) {
            res.send(err);
        });
    });

    app.post("/addParticipant", function (req, res) {
        // TODO: Add validation checks
        var participantId = req.body.participantId;
        var competitionId = req.body.competitionId;

        var params = {
            participantId: participantId,
            competitionId: competitionId
        }

        db.UserCompetition.create(params).then(function (dbUserCompetition) {
            res.json(dbUserCompetition);
        }).catch(function (err) {
            res.send(err);
        });

    });

    app.get("/entries/:id", function (req, res) {
        var id = req.params.id
        if (!id) {
            return res.status(400).json({ error: "Missing id" });
        }

        db.CompetitionEntry.findAll({
            where: { competitionId: id },
            attributes: ['value'],
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'name', 'createdAt']
            }]
        }).then(function (dbCompetitionEntries) {
            res.json(dbCompetitionEntries);
        });

    });

};
