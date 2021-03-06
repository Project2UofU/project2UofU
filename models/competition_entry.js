module.exports = function (sequelize, DataTypes) {
    var CompetitionEntry = sequelize.define("CompetitionEntry", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    CompetitionEntry.associate = function (models) {
        CompetitionEntry.belongsTo(models.Competition, { as: "competition", foreignKey: { foreignKey: "competitionId", allowNull: false } });
        CompetitionEntry.belongsTo(models.User, { as: "user", foreignKey: { foreignKey: "userId", allowNull: false } });
    };

    return CompetitionEntry;
};
