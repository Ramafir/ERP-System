const app = require('../../../src/app');
const request = require('supertest-session')(app);
const { StatusCodes } = require('http-status-codes');

const UserFactory = require('../../factories/user');

let users = [];
let adminData = null;

describe('Users', () => {
    beforeAll(async () => {
        const userData = UserFactory.generate();
        adminData = UserFactory.generate({});

        const admin = await UserFactory.create(adminData);
        const employee = await UserFactory.create(userData);

        await admin.addRole(adminRole);
        await employee.addRole(employeeRole);

        users.push(await UserFactory.create());
    });
    afterEach(async () => {
        await request.post('/api/auth/logout').send();
    });
    describe('DELETE /api/users/{id}', () => {
        test('should return 204 sending valid request AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body, statusCode } = await request
                .delete(`/api/users/${users[0].id}`)
                .send();

            expect(body.deletedAt).not.toBeNull();
            expect(statusCode).toEqual(StatusCodes.NO_CONTENT);
        });

        test('should return 204 deleting NON-EXIST user AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode } = await request
                .delete(`/api/users/81b612f0-b1a2-11ec-b909-0242ac120002`)
                .send();

            expect(statusCode).toEqual(StatusCodes.NO_CONTENT);
        });

        test('should return 403 sending request AS EMPLOYEE', async () => {
            const userData = UserFactory.generate();

            await UserFactory.create(userData);

            const { email, password } = userData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode } = await request
                .delete(`/api/users/${users[0].id}`)
                .send();

            expect(statusCode).toEqual(StatusCodes.FORBIDDEN);
        });

        test('should return 401 sending request AS NON-USER', async () => {
            const { statusCode } = await request
                .delete(`/api/users/${users[0].id}`)
                .send();

            expect(statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        });
    });
});
