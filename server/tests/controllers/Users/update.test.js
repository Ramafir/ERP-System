const { StatusCodes } = require('http-status-codes');
const UserFactory = require('../../factories/user');

let users = [];
let adminData = null;

describe('Users', () => {
    beforeAll(async () => {
        adminData = UserFactory.generate({});

        const admin = await UserFactory.create(adminData);

        await admin.addRole(adminRole);

        users.push(await UserFactory.create());
    });
    afterEach(async () => {
        await request.post('/api/auth/logout').send();
    });
    describe('PUT /api/users/{id}', () => {
        test('should return 200 sending valid request AS ADMIN', async () => {
            const userData = UserFactory.generate({
                firstName: 'updated'
            });

            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode, body } = await request
                .put(`/api/users/${users[0].id}`)
                .send(userData);

            delete userData.password;

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(body).toEqual({
                ...userData,
                id: users[0].id,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
                fullName: `${userData.firstName} ${userData.lastName}`,
                deletedAt: null,
                vacationDaysTotal: users[0].vacationDaysTotal,
                vacationDaysTaken: users[0].vacationDaysTaken
            });
            expect(body).not.toHaveProperty([
                'password',
                'passwordResetTokenExpiresAt',
                'passwordResetToken'
            ]);
        });

        test('should return 400 sending empty request AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body, statusCode } = await request
                .put(`/api/users/${users[0].id}`)
                .send({});

            expect(body).toHaveProperty('errors');
            expect(body.errors).toMatchObject([
                { message: 'First name is required.', param: 'firstName' },
                {
                    message: 'First name must have more than 2 characters.',
                    param: 'firstName'
                },
                { message: 'Last name is required.', param: 'lastName' },
                {
                    message: 'Last Name must have more than 2 characters.',
                    param: 'lastName'
                },
                { message: 'Birth date is required.', param: 'birthDate' },
                { message: 'Date is not valid', param: 'birthDate' },
                { message: 'Email is required.', param: 'email' },
                { message: 'Email is not valid.', param: 'email' }
            ]);
            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });

        test('should return 400 sending invalid request AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body, statusCode } = await request
                .put(`/api/users/${users[0].id}`)
                .send({
                    firstName: 'a',
                    lastName: 'b',
                    birthDate: '0',
                    password: '1',
                    email: '2'
                });

            expect(body).toHaveProperty('errors');
            expect(body.errors).toMatchObject([
                {
                    message: 'First name must have more than 2 characters.',
                    param: 'firstName'
                },
                {
                    message: 'Last Name must have more than 2 characters.',
                    param: 'lastName'
                },
                { message: 'Date is not valid', param: 'birthDate' },
                { message: 'Email is not valid.', param: 'email' }
            ]);
            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });

        test('should return 403 sending valid request AS EMPLOYEE', async () => {
            const userData = UserFactory.generate();

            await UserFactory.create(userData);

            const { email, password } = userData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode } = await request
                .put(`/api/users/${users[0].id}`)
                .send({});

            expect(statusCode).toEqual(StatusCodes.FORBIDDEN);
        });

        test('should return 401 sending request AS NON-USER', async () => {
            const { statusCode } = await request
                .put(`/api/users/${users[0].id}`)
                .send({ firstName: 'updated' });

            expect(statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        });
    });
});
