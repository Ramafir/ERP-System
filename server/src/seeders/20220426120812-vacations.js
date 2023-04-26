'use strict';

const UserFactory = require('../../tests/factories/user');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const user = await UserFactory.create();
        const user2 = await UserFactory.create();

        await queryInterface.bulkInsert('Vacations', [
            {
                id: '151521bc-b978-11ec-8422-0242ac120002',
                userId: user.id,
                startDate: '2022-01-02',
                endDate: '2022-01-02',
                confirmed: false,
                duration: 1
            },
            {
                id: '213721bc-b978-11ec-8422-0242ac120002',
                userId: user2.id,
                startDate: '2022-01-01',
                endDate: '2022-01-02',
                confirmed: true,
                duration: 1
            }
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Vacations', null, {});
    }
};
