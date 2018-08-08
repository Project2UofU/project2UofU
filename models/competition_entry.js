module.exports = function (sequelize, DataTypes) {
    var CompetitionEntry = sequelize.define("CompetitionEntry", {
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    CompetitionEntry.associate = function (models) {
        CompetitionEntry.belongsTo(models.Competition, { as: 'competition', foreignKey: { allowNull: false } });
        CompetitionEntry.belongsTo(models.User, { as: 'user', foreignKey: { allowNull: false } });
    };

    return CompetitionEntry;
};
