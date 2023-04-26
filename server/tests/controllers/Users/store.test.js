const { StatusCodes } = require('http-status-codes');
const UserFactory = require('../../factories/user');

let adminData = null;

describe('Users', () => {
    beforeAll(async () => {
        adminData = UserFactory.generate({});

        const admin = await UserFactory.create(adminData);

        admin.addRole(adminRole);
    });
    afterEach(async () => {
        await request.post('/api/auth/logout').send();
    });
    describe('POST /api/users', () => {
        test('should return 201 sending valid data AS ADMIN', async () => {
            const userData = UserFactory.generate();

            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode, body } = await request
                .post('/api/users')
                .send(userData);

            delete userData.password;

            expect(body).toEqual({
                ...userData,
                vacationDaysTotal: 0,
                vacationDaysTaken: 0,
                deletedAt: null,
                fullName: `${userData.firstName} ${userData.lastName}`,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
                id: expect.anything()
            });

            expect(body).not.toHaveProperty([
                'password',
                'passwordResetTokenExpiresAt',
                'passwordResetToken'
            ]);

            expect(statusCode).toEqual(StatusCodes.CREATED);
        });

        test('should return 400 sending empty data AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body, statusCode } = await request
                .post('/api/users')
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
                { message: 'Email is not valid.', param: 'email' },
                { message: 'Password is required.', param: 'password' },
                {
                    message:
                        'Password should be between 8 and 254 characters long.',
                    param: 'password'
                }
            ]);
            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });

        test('should return 400 sending invalid data AS ADMIN', async () => {
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body, statusCode } = await request.post('/api/users').send({
                firstName: 'e',
                lastName: 'f',
                password: '1',
                email: '2',
                birthDate: '3',
                role: 'g'
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
                { message: 'Email is not valid.', param: 'email' },
                {
                    message:
                        'Password should be between 8 and 254 characters long.',
                    param: 'password'
                }
            ]);
            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });

        test('should return 403 sending valid data AS USER', async () => {
            const employeeUser = UserFactory.generate();

            const userData = UserFactory.generate();

            await UserFactory.create(employeeUser);

            const { email, password } = employeeUser;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { statusCode } = await request
                .post('/api/users')
                .send(userData);

            expect(statusCode).toEqual(StatusCodes.FORBIDDEN);
        });

        test('should return 401 sending valid data AS NON-USER', async () => {
            const userData = UserFactory.generate();

            const { statusCode } = await request
                .post('/api/users')
                .send(userData);

            expect(statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        });
    });
});
