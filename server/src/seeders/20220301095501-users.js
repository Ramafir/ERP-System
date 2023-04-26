'use strict';

const UserFactory = require('../../tests/factories/user');
const { Role } = require('../models');
const roleRepository = di.get('repositories.role');

module.exports = {
    up: async () => {
        const adminRole = await roleRepository.create({ name: Role.ADMIN });

        const employeeRole = await roleRepository.create({
            name: Role.EMPLOYEE
        });

        for (let i = 1; i <= 20; i++) {
            const user = await UserFactory.create({});

            await user.addRole(employeeRole);
        }

        const adminUser = await UserFactory.create({
            email: 'admin@erpsystem.test',
            password: 'Admin123!'
        });

        const employeeUser = await UserFactory.create({
            email: 'employee@erpsystem.test',
            password: 'Employee123!'
        });

        await adminUser.addRole(adminRole);
        await employeeUser.addRole(employeeRole);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
