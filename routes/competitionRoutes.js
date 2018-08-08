var path = require("path");
var db = require(path.join(__dirname, "../models"));

// /api/competition/*
module.exports = function (app) {

    app.post("/create", function (req, res) {
        if (!req.body.title) {
            return res.status(400).json({ error: "Missing title" });
        } else if (!req.body.ownerId) {
            return res.status(400).json({ error: "Missing ownerId" });
        }

        // TODO: Find a better way to do this
        db.User.findOne({
            where: { id: req.body.ownerId }
        }).then(function (dbUser) {
            db.Competition.create(req.body).then(function (dbCompetition) {
                var params = {
                    participantId: dbUser.id,
                    competitionId: dbCompetition.id
                }

                db.UserCompetition.create(params).then(function (dbUserCompetition) {
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

    app.get("/:id", function (req, res) {
        var id = req.params.id
        if (!id) {
            return res.status(400).json({ error: "Missing id" });
        }

        db.Competition.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'title', 'createdAt'],
            include: [{
                model: db.User,
                as: 'owner',
                attributes: ['id', 'name']
            }]
        }).then(function (dbCompetition) {
            res.json(dbCompetition);
        });
    });


    app.post("/addEntry", function (req, res) {
        console.log(req.body);
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

    app.get("/entries", function (req, res) {
        var competitionId = req.query.competitionId
        if (!competitionId) {
            return res.status(400).json({ error: "Missing competitionId" });
        }

        db.CompetitionEntry.findAll({
            where: { competitionId: competitionId },
            attributes: ['value'],
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'name']
            }, {
                model: db.Competition,
                as: 'competition',
                attributes: ['id', 'title']
            }]
        }).then(function (dbCompetitionEntries) {
            res.json(dbCompetitionEntries);
        });

    });

};
