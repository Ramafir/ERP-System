'use strict';

const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    let Role = {};

    if (sequelize) {
        Role = sequelize.define(
            'Role',
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                }
            },
            {
                paranoid: true,
                timestamps: true
            }
        );
    }

    Role.associate = ({ User }) => {
        Role.belongsToMany(User, {
            as: 'users',
            through: 'User2Role',
            foreignKey: 'roleId',
            otherKey: 'userId'
        });
    };

    Role.ADMIN = 'admin';
    Role.EMPLOYEE = 'employee';

    return Role;
};
