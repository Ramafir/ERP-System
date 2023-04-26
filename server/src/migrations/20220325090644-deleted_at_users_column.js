'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.addColumn('Users', 'deletedAt', {
            type: DataTypes.DATE,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'deletedAt');
    }
};
