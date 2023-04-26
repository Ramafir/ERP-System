'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable(
            'Vacations',
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
                confirmed: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
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
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Vacations');
    }
};
