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
    describe('GET /api/users', () => {
        test('should return 200 sending valid request AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body, statusCode } = await request
                .get('/api/users')
                .query({ query: adminData.firstName });

            for (const user of users) {
                expect.arrayContaining(
                    body.rows[
                        {
                            ...user
                        }
                    ]
                );
            }

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(body.rows).toHaveLength(body.count);
        });

        test('should return 403 sending valid request AS EMPLOYEE', async () => {
            const userData = UserFactory.generate();
            await UserFactory.create(userData);

            const { email, password } = userData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode } = await request.get('/api/users');

            expect(statusCode).toEqual(StatusCodes.FORBIDDEN);
        });

        test('should return 401 sending valid request AS NON-USER', async () => {
            const { statusCode } = await request.get('/api/users');

            expect(statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        });
    });
});
