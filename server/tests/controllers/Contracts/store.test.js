const { StatusCodes } = require('http-status-codes');
const UserFactory = require('../../factories/user');
const ContractFactory = require('../../factories/contract');

const contractRepository = di.get('repositories.contract');

let users = [];
let adminData = null;
let roleEmployee;

describe('Contracts', () => {
    beforeAll(async () => {
        adminData = UserFactory.generate();

        const admin = await UserFactory.create(adminData);
        users.push(await UserFactory.create());

        await admin.addRole(adminRole);
        await users[0].addRole(employeeRole);
    });
    afterEach(async () => {
        await request.post('/api/auth/logout').send();
    });

    describe('ContractController', () => {
        describe('POST api/contracts', () => {
            test('should return 201 sending valid data AS ADMIN', async () => {
                const contractData = ContractFactory.generate({
                    userId: users[0].id
                });
                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode, body } = await request
                    .post('/api/contracts')
                    .send(contractData);

                delete body.user;

                expect(body).toEqual({
                    ...contractData,
                    deletedAt: null,
                    createdAt: expect.anything(),
                    updatedAt: expect.anything(),
                    endDate: expect.anything(),
                    availableDaysOffAmount: expect.anything(),
                    id: expect.anything()
                });
                expect(statusCode).toEqual(StatusCodes.CREATED);
            });

            test('should return 500 WHEN contract.create FAILED as ADMIN', async () => {
                const contractData = ContractFactory.generate({
                    startDate: '2020-03-01',
                    duration: 1,
                    userId: users[0].id
                });

                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const spyContractCreate = await jest
                    .spyOn(contractRepository, 'create')
                    .mockImplementation(() => {
                        throw new Error('DB connection lost');
                    });

                const { statusCode } = await request
                    .post('/api/contracts')
                    .send(contractData);

                expect(spyContractCreate).toHaveBeenCalled();
                expect(statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);

                spyContractCreate.mockClear();
            });

            test('should return 400 sending empty data AS ADMIN', async () => {
                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode, body } = await request
                    .post('/api/contracts')
                    .send({});

                expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
                expect(body).toHaveProperty('errors');
                expect(body.errors).toMatchObject([
                    { message: 'Start date is required', param: 'startDate' },
                    { message: 'Date must be valid', param: 'startDate' },
                    {
                        message:
                            'WHERE parameter "userId" has invalid "undefined" value',
                        param: 'startDate'
                    },
                    { message: 'Duration is required', param: 'duration' },
                    {
                        message: 'Contract must be for at least 1 month',
                        param: 'duration'
                    },
                    { message: 'Should be integer type', param: 'duration' },
                    { message: 'User ID is required', param: 'userId' },
                    { message: 'Must be valid UUID', param: 'userId' },
                    {
                        message: 'Job position is required.',
                        param: 'jobPosition'
                    },
                    {
                        message:
                            'Job position must have more than 2 characters.',
                        param: 'jobPosition'
                    },
                    {
                        message: 'Should not be empty',
                        param: 'vacationsPerYear'
                    },
                    {
                        message: 'Should be integer type',
                        param: 'vacationsPerYear'
                    }
                ]);
            });

            test('should return 400 sending invalid data AS ADMIN', async () => {
                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode, body } = await request
                    .post('/api/contracts')
                    .send({
                        startDate: 1,
                        duration: 'a',
                        userId: 2,
                        jobPosition: 'b',
                        vacationsPerYear: 'c'
                    });

                expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
                expect(body).toHaveProperty('errors');
                expect(body.errors).toMatchObject([
                    { message: 'Date must be valid', param: 'startDate' },
                    { message: 'Should be integer type', param: 'duration' },
                    { message: 'Must be valid UUID', param: 'userId' },
                    {
                        message:
                            'Job position must have more than 2 characters.',
                        param: 'jobPosition'
                    },
                    {
                        message: 'Should be integer type',
                        param: 'vacationsPerYear'
                    }
                ]);
            });

            test('should return 403 sending valid data AS USER', async () => {
                const employeeUser = UserFactory.generate();
                const contractData = ContractFactory.generate();
                const user = await UserFactory.create(employeeUser);
                await user.addRole(roleEmployee);
                const { email, password } = employeeUser;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { statusCode } = await request
                    .post('/api/contracts')
                    .send(contractData);

                expect(statusCode).toEqual(StatusCodes.FORBIDDEN);
            });

            test('should return 401 sending valid data AS NON-USER', async () => {
                const contractData = ContractFactory.generate();

                const { statusCode } = await request
                    .post('/api/contracts')
                    .send(contractData);

                expect(statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            });
        });
    });
});
