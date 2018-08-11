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
    //     "competition": {
    //         "title": "Weight Loss",
    //         "id": "d4c39b3f-c644-4c51-a184-3826766793c4",
    //         "participants": [
    //             {
    //                 "name": "Michael",
    //                 "id": "fdec64f2-727b-440a-9aa5-5f4c71185cca",
    //                 "entries": [
    //                     {
    //                         "date": "2018-08-11T16:30:30.000Z",
    //                         "value": 351
    //                     },
    //                     {
    //                         "date": "2018-08-11T17:35:40.000Z",
    //                         "value": 61
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "Thomas",
    //                 "id": "1760c27d-d2a2-4923-9c8c-c8fdc35b027f",
    //                 "entries": [
    //                     {
    //                         "date": "2018-08-11T16:37:10.000Z",
    //                         "value": 741
    //                     },
    //                     {
    //                         "date": "2018-08-11T22:04:10.000Z",
    //                         "value": 238
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "Daniel",
    //                 "id": "50f69310-0bce-40b2-bfe5-501c455b1bae",
    //                 "entries": [
    //                     {
    //                         "date": "2018-08-11T18:49:40.000Z",
    //                         "value": 124
    //                     },
    //                     {
    //                         "date": "2018-08-11T19:20:30.000Z",
    //                         "value": 714
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // }

    // URL: api/competition/[id]
    // Method: GET
    // Description: Get Competitions with their participants
    app.get("/:id", function (req, res) {
        var id = req.params.id
        if (!id) {
            return res.status(400).json({ error: "Missing competition id" });
        }

        console.log("Cometition: " + id);
        return db.Competition.findOne({
            where: { id: id },
            attributes: ['id', 'title', 'createdAt', 'updatedAt'],
            include: {
                as: "competitions",
                model: db.UserCompetition,
                attributes: ["id"],
                include: [{
                    model: db.User,
                    as: "participant",
                    attributes: ["name", "id"],
                    include: {
                        as: "entries",
                        model: db.CompetitionEntry,
                        attributes: ["value", "date"]
                    }
                }]
            }
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
                    id: userCompetition.participant.id,
                    entries: []
                }

                var entries = userCompetition.participant.entries
                if (entries) {
                    userCompetition.participant.entries.forEach(entry => {
                        var entryObject = {
                            date: entry.date,
                            value: entry.value
                        };
                        user.entries.push(entryObject);
                    })
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
        var participantId = req.body.participantId;
        var competitionId = req.body.competitionId;
        if (!req.body.participantId) {
            return res.status(400).json({ error: "Missing participantId" });
        } else if (!req.body.competitionId) {
            return res.status(400).json({ error: "Missing competitionId" });
        }

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

};
