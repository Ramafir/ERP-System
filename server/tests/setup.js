const app = require('../src/app');
const request = require('supertest-session')(app);
const di = require('../src/di');
const { Role } = require('../src/models');

const roleRepository = di.get('repositories.role');

global.di = di;
global.request = request;

jest.setTimeout(5000);

beforeAll(async () => {
    global.adminRole = await roleRepository.findOneByName(Role.ADMIN);
    global.employeeRole = await roleRepository.findOneByName(Role.EMPLOYEE);
});

afterAll(async () => {
    jest.clearAllMocks();
    const redisSessionClient = di.get('services.redisClient');
    await redisSessionClient.disconnect();
});
