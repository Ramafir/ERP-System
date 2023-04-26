const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    let Contract = {};

    if (sequelize) {
        Contract = sequelize.define(
            'Contract',
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
                jobPosition: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                vacationsPerYear: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                availableDaysOffAmount: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                timestamps: true,
                paranoid: true
            }
        );
    }

    Contract.associate = ({ User }) => {
        Contract.belongsTo(User, {
            as: 'user',
            foreignKey: 'userId',
            sourceKey: 'id'
        });
    };

    return Contract;
};
