'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.addColumn('Users', 'vacationDaysTotal', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        });
        await queryInterface.addColumn('Users', 'vacationDaysTaken', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'vacationDaysTotal');
        await queryInterface.removeColumn('Users', 'vacationDaysTaken');
    }
};
