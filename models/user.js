module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: DataTypes.STRING,
        facebookId: DataTypes.STRING,
        googleId: DataTypes.STRING,
        password: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        }
    }, {
            hooks: {
                beforeFind: function (options) {
                    options.attributes = {};
                    options.attributes.exclude = ['createdAt', 'updatedAt', 'password', 'facebookId', 'googleId'];
                    return options;
                }
            }
        }
    );

    User.associate = function (models) {
        User.hasMany(models.Competition, { foreignKey: 'ownerId', onDelete: 'cascade' });
        User.belongsToMany(models.Competition, { foreignKey: 'participantId', through: 'UserCompetition' });
        User.hasMany(models.UserCompetition, { foreignKey: 'participantId', onDelete: 'cascade' });
        User.hasMany(models.CompetitionEntry, { foreignKey: 'userId', onDelete: 'cascade' });
    };

    return User;
};
