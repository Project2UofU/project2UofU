module.exports = function (sequelize, DataTypes) {
    var UserCompetition = sequelize.define("UserCompetition", {
        
    });

    UserCompetition.associate = function (models) {
        UserCompetition.belongsTo(models.User, { as: 'participant', through: 'UserCompetition' });
        UserCompetition.belongsTo(models.Competition, { as: 'competition', through: 'UserCompetition' });
    };

    return UserCompetition;
};
