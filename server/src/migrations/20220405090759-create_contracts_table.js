'use strict';

module.exports = {
    up: (queryInterface, DataTypes) =>
        queryInterface.createTable(
            'Contracts',
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
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
                    allowNull: false,
                    defaultValue: 3
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
                },
                createdAt: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('NOW()')
                },
                updatedAt: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('NOW()')
                },
                deletedAt: {
                    allowNull: true,
                    type: DataTypes.DATE
                }
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        ),

    down: queryInterface => queryInterface.dropTable('Contracts')
};
