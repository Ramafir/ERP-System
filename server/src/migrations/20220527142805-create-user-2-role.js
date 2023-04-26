'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('User2Role', {
            userId: {
                primaryKey: true,
                type: DataTypes.UUID
            },
            roleId: {
                primaryKey: true,
                type: DataTypes.UUID
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('User2Role');
    }
};
