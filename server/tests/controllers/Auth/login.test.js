const { StatusCodes } = require('http-status-codes');

const UserFactory = require('../../factories/user');

describe('Auth routes', () => {
    describe('POST /api/auth/login', () => {
        test('should return 200 sending valid data', async () => {
            const userData = UserFactory.generate();

            await UserFactory.create(userData);

            const { email, password } = userData;

            const res = await request
                .post('/api/auth/login')
                .send({ email, password });

            expect(res.status).toEqual(StatusCodes.OK);

            delete userData.password;

            expect(res.body).toEqual({
                ...userData,
                roles: [],
                id: expect.anything(),
                fullName: `${userData.firstName} ${userData.lastName}`,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
                deletedAt: null
            });
        });

        test('should return 401 error if there are no users with that email', async () => {
            const res = await request
                .post('/api/auth/login')
                .send({ email: 'not@exist.test', password: 'Somepass1!' });

            expect(res.status).toEqual(StatusCodes.UNAUTHORIZED);
        });

        test('should return 401 error if password is wrong', async () => {
            const userData = UserFactory.generate();

            await UserFactory.create(userData);

            const { email } = userData;

            const res = await request
                .post('/api/auth/login')
                .send({ email, password: 'wrongPass1!' });

            expect(res.status).toEqual(StatusCodes.UNAUTHORIZED);
        });

        test('should return 400 sending empty data', async () => {
            const res = await request.post('/api/auth/login').send({});

            expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toMatchObject([
                { message: 'Email is required', param: 'email' },
                { message: 'Must be valid e-mail', param: 'email' },
                { message: 'Password is required', param: 'password' },
                {
                    message: 'Password length must be between 8 and 254',
                    param: 'password'
                },
                {
                    message:
                        'Min. 8 characters with at least one capital letter, a number and a special character.',
                    param: 'password'
                }
            ]);
        });

        test('should return 400 sending invalid data', async () => {
            const res = await request
                .post('/api/auth/login')
                .send({ email: 'u', password: '1' });

            expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toMatchObject([
                { message: 'Must be valid e-mail', param: 'email' },
                {
                    message: 'Password length must be between 8 and 254',
                    param: 'password'
                },
                {
                    message:
                        'Min. 8 characters with at least one capital letter, a number and a special character.',
                    param: 'password'
                }
            ]);
        });

        test('should return 400 error if e-mail and password is too long', async () => {
            const email = 'a'.repeat(250) + '@erp.test';
            const password = 'a'.repeat(260) + '1!Aa';

            const res = await request.post('/api/auth/login').send({
                email,
                password
            });

            expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toMatchObject([
                { message: 'Must be valid e-mail', param: 'email' },
                {
                    message: 'Email must be maximum 254 characters long',
                    param: 'email'
                },
                {
                    message: 'Password length must be between 8 and 254',
                    param: 'password'
                }
            ]);
        });
    });
});
