const { StatusCodes } = require('http-status-codes');
const UserFactory = require('../../factories/user');
const VacationFactory = require('../../factories/vacation');

const vacationRepository = di.get('repositories.vacation');

let users = [];
let adminData = null;

describe('Vacations', () => {
    beforeAll(async () => {
        adminData = UserFactory.generate();

        const admin = await UserFactory.create(adminData);

        await admin.addRole(adminRole);

        users.push(
            await UserFactory.create({
                vacationDaysTotal: 20,
                vacationDaysTaken: 5
            })
        );

        users.push(await UserFactory.create({}));

        await users[0].addRole(employeeRole);
        await users[1].addRole(employeeRole);
    });
    afterEach(async () => {
        await request.post('/api/auth/logout').send();
    });

    describe('VacationController', () => {
        describe('POST api/vacations', () => {
            test('should return 201 sending valid data AS ADMIN', async () => {
                const vacationData = VacationFactory.generate({
                    userId: users[0].id,
                    startDate: '2022-05-16',
                    endDate: '2022-05-20'
                });

                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode, body } = await request
                    .post('/api/vacations')
                    .send(vacationData);

                const {
                    body: { vacationDaysTaken }
                } = await request.get(`/api/users/${users[0].id}`);

                expect(vacationDaysTaken).toEqual(10);

                delete body.user;

                expect(body).toEqual({
                    ...vacationData,
                    duration: 5,
                    confirmed: true,
                    deletedAt: null,
                    createdAt: expect.anything(),
                    updatedAt: expect.anything(),
                    id: expect.anything()
                });

                expect(statusCode).toEqual(StatusCodes.CREATED);
            });

            test('should return 201 sending valid data and userId should match AS USER', async () => {
                const employeeUserData = UserFactory.generate();

                const employeeCreatedData = await UserFactory.create(
                    employeeUserData
                );

                const vacationData = await VacationFactory.generate({
                    userId: employeeCreatedData.id,
                    startDate: '2022-01-01',
                    endDate: '2022-01-03'
                });

                const { email, password } = employeeUserData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode, body } = await request
                    .post('/api/vacations')
                    .send(vacationData);

                delete body.user;

                expect(body).toEqual({
                    ...vacationData,
                    id: expect.anything(),
                    userId: employeeCreatedData.id,
                    confirmed: false,
                    duration: expect.anything(),
                    createdAt: expect.anything(),
                    updatedAt: expect.anything(),
                    deletedAt: null
                });

                expect(statusCode).toEqual(StatusCodes.CREATED);
            });

            test('should return 500 WHEN vacation.store FAILED as ADMIN', async () => {
                const vacationData = VacationFactory.generate({
                    startDate: '2022-01-01',
                    endDate: '2022-01-03',
                    userId: users[0].id
                });

                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const spyVacationCreate = await jest
                    .spyOn(vacationRepository, 'create')
                    .mockImplementation(() => {
                        throw new Error('UFO killed the database');
                    });

                const { statusCode } = await request
                    .post('/api/vacations')
                    .send(vacationData);

                expect(spyVacationCreate).toHaveBeenCalled();
                expect(statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);

                spyVacationCreate.mockClear();
            });

            test('should return 400 sending empty data AS ADMIN', async () => {
                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode, body } = await request
                    .post('/api/vacations')
                    .send({});

                expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
                expect(body).toHaveProperty('errors');
                expect(body.errors).toMatchObject([
                    { message: 'Start date is required', param: 'startDate' },
                    { message: 'End date is required', param: 'endDate' }
                ]);
            });

            test('should return 400 sending invalid data AS ADMIN', async () => {
                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode, body } = await request
                    .post('/api/vacations')
                    .send({
                        userId: 1,
                        startDate: 2,
                        endDate: 3
                    });

                expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
                expect(body).toHaveProperty('errors');
                expect(body.errors).toMatchObject([
                    { message: 'Date must be valid', param: 'startDate' },
                    { message: 'Date must be valid', param: 'endDate' },
                    { message: 'Must be valid UUID', param: 'userId' }
                ]);
            });

            test('should return 400 sending valid data AS ANOTHER USER', async () => {
                const employeeUserData = UserFactory.generate();

                await UserFactory.create(employeeUserData);

                const vacationData = await VacationFactory.generate({
                    startDate: '2022-01-01',
                    endDate: '2022-01-02',
                    userId: users[1].id
                });

                const { email, password } = employeeUserData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode, body } = await request
                    .post('/api/vacations')
                    .send(vacationData);

                expect(body).toHaveProperty('errors');
                expect(body.errors).toMatchObject([
                    {
                        message: 'User ID is not the same as the logged user',
                        param: 'userId'
                    }
                ]);
                expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
            });

            test('should return 401 sending valid data AS NON-USER', async () => {
                const vacationData = VacationFactory.generate();

                const { statusCode } = await request
                    .post('/api/vacations')
                    .send(vacationData);

                expect(statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            });
        });
    });
});
