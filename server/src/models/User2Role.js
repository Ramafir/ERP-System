'use strict';

const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    let User2Role = {};

    if (sequelize) {
        User2Role = sequelize.define(
            'User2Role',
            {
                userId: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                roleId: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: 'Roles',
                        key: 'id'
                    }
                }
            },
            {
                freezeTableName: true
            }
        );
    }

    return User2Role;
};
