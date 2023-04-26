const truncateDatabase = require('./helpers/truncate');
const di = require('../src/di');
const { Role } = require('../src/models');

const roleRepository = di.get('repositories.role');

global.di = di;

module.exports = async () => {
    await truncateDatabase();
    await roleRepository.create({ name: Role.EMPLOYEE });
    await roleRepository.create({ name: Role.ADMIN });
};
