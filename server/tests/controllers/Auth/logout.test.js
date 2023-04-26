const { StatusCodes } = require('http-status-codes');

const UserFactory = require('../../factories/user');

describe('Auth routes', () => {
    describe('POST /api/auth/logout', () => {
        test('should return 204 sending valid request AS USER', async () => {
            const userData = UserFactory.generate();

            await UserFactory.create(userData);

            const { email, password } = userData;

            const res = await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            expect(res.headers).toHaveProperty('set-cookie');

            const logoutResponse = await request
                .post('/api/auth/logout')
                .send();

            expect(logoutResponse.status).toEqual(StatusCodes.NO_CONTENT);
        });

        test('should return 204 sending valid request AS NON-USER', async () => {
            const logoutResponse = await request
                .post('/api/auth/logout')
                .send();

            expect(logoutResponse.status).toEqual(StatusCodes.NO_CONTENT);
        });
    });
});
