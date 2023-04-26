const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    let Vacation = {};

    if (sequelize) {
        Vacation = sequelize.define(
            'Vacation',
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    onDelete: 'cascade',
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                startDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                endDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                duration: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                confirmed: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    default: false
                }
            },
            {
                timestamps: true,
                paranoid: true
            }
        );
    }

    Vacation.associate = ({ User }) => {
        Vacation.belongsTo(User, {
            as: 'user',
            foreignKey: 'userId',
            sourceKey: 'id'
        });
    };

    return Vacation;
};
