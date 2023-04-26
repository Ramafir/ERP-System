'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable(
            'Users',
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4
                },
                firstName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                birthDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                passwordResetToken: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                passwordResetTokenExpiresAt: {
                    allowNull: true,
                    type: DataTypes.DATE
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('NOW()'),
                    allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.literal('NOW()'),
                    allowNull: false
                }
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('Users');
    }
};
