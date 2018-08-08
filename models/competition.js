module.exports = function (sequelize, DataTypes) {
    var Competition = sequelize.define("Competition", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }, public: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }, id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        }
    });

    Competition.associate = function (models) {
        Competition.belongsTo(models.User, { as: 'owner', foreignKey: { allowNull: false } });
        Competition.belongsToMany(models.User, { foreignKey: 'competitionId', through: 'UserCompetition' });
        Competition.hasMany(models.UserCompetition, { foreignKey: 'competitionId', onDelete: 'cascade' });
        Competition.hasMany(models.CompetitionEntry, { foreignKey: 'competitionId', onDelete: 'cascade' });
    };

    return Competition;
};
