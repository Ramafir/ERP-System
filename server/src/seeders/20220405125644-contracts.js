'use strict';

const UserFactory = require('../../tests/factories/user');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const user = await UserFactory.create();
        const user2 = await UserFactory.create();

        await queryInterface.bulkInsert('Contracts', [
            {
                id: '151521bc-b978-11ec-8422-0242ac120002',
                userId: user.id,
                startDate: '2022-01-02',
                endDate: '2022-02-01',
                jobPosition: 'Developer',
                duration: 1,
                vacationsPerYear: 20,
                availableDaysOffAmount: 2
            },
            {
                id: '213721bc-b978-11ec-8422-0242ac120002',
                userId: user2.id,
                startDate: '2022-01-02',
                endDate: '2022-02-01',
                jobPosition: 'Developer',
                duration: 1,
                vacationsPerYear: 20,
                availableDaysOffAmount: 2
            }
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Contracts', null, {});
    }
};
