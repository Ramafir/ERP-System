const { StatusCodes } = require('http-status-codes');

const UserFactory = require('../../factories/user');

let users = [];
let adminData = null;

describe('Users', () => {
    beforeAll(async () => {
        users.push(await UserFactory.create());
        users.push(await UserFactory.create());
        users.push(await UserFactory.create());

        adminData = UserFactory.generate({});

        const admin = await UserFactory.create(adminData);

        await admin.addRole(adminRole);
    });
    afterEach(async () => {
        await request.post('/api/auth/logout').send();
    });
    describe('GET /api/users/{id}', () => {
        test('should return 200 sending valid request AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body, statusCode } = await request.get(
                `/api/users/${users[0].id}`
            );

            expect(body).toHaveProperty('email');
            expect(body.email).toEqual(users[0].email);
            expect(statusCode).toEqual(StatusCodes.OK);
        });

        test('should return 404 if USER NOT-EXIST sending valid request AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode } = await request.get(
                '/api/users/2c2c3a4b-44cd-4d35-b48c-b71caf5e2836'
            );

            expect(statusCode).toEqual(StatusCodes.NOT_FOUND);
        });

        test('should return 403 if sending valid request AS EMPLOYEE', async () => {
            const userData = UserFactory.generate();
            await UserFactory.create(userData);

            const { email, password } = userData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode } = await request.get(
                `/api/users/${users[0].id}`
            );

            expect(statusCode).toEqual(StatusCodes.FORBIDDEN);
        });

        test('should return 401 sending valid request AS NON-USER', async () => {
            const { statusCode } = await request.get(
                `/api/users/${users[0].id}`
            );

            expect(statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        });
    });
});
