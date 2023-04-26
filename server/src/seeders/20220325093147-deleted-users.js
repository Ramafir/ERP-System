'use strict';

const dayjs = require('dayjs');
const UserFactory = require('../../tests/factories/user');
const di = require('../di');
const { Role } = require('../models');

module.exports = {
    up: async () => {
        const roleRepository = di.get('repositories.role');

        const roleEmployee = await roleRepository.findOneByName(Role.EMPLOYEE);

        for (let i = 1; i <= 30; i++) {
            const user = await UserFactory.create({
                deletedAt: dayjs()
            });

            await user.addRole(roleEmployee);
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
