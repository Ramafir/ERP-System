const { StatusCodes } = require('http-status-codes');
const UserFactory = require('../../factories/user');
const ContractFactory = require('../../factories/contract');

const contractRepository = di.get('repositories.contract');
const userRepository = di.get('repositories.user');

let adminData = null;
let users = [];

describe('Contracts', () => {
    beforeAll(async () => {
        adminData = UserFactory.generate();

        const admin = await UserFactory.create(adminData);

        await admin.addRole(adminRole);

        users.push(await UserFactory.create());
        users.push(await UserFactory.create());

        await users[0].addRole(employeeRole);
        await users[1].addRole(employeeRole);
    });
    afterEach(async () => {
        await request.post('/api/auth/logout').send();
    });
    describe('PUT /contracts/:id', () => {
        test('should return 200 sending valid data AS ADMIN', async () => {
            const contractBeforeUpdateData = ContractFactory.generate({
                startDate: '2022-02-01',
                duration: 1,
                userId: users[0].id
            });

            const contractAfterUpdateData = ContractFactory.generate({
                startDate: '2022-03-01',
                duration: 1
            });

            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body: contract } = await request
                .post('/api/contracts')
                .send(contractBeforeUpdateData);

            delete contractAfterUpdateData.userId;

            const { statusCode, body } = await request
                .put(`/api/contracts/${contract.id}`)
                .send({ ...contractAfterUpdateData, userId: contract.userId });

            delete body.user;

            expect(statusCode).toEqual(StatusCodes.OK);

            expect(body).toEqual({
                ...contractAfterUpdateData,
                id: contract.id,
                userId: contract.userId,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
                deletedAt: null,
                endDate: expect.anything(),
                availableDaysOffAmount: expect.anything()
            });
        });

        test('should return 500 WHEN contract.update FAILED as ADMIN', async () => {
            const contractBeforeUpdateData = ContractFactory.generate({
                startDate: '2022-01-01',
                duration: 1,
                userId: users[1].id
            });
            const contractAfterUpdateData = ContractFactory.generate({
                startDate: '2022-02-01',
                duration: 1,
                userId: users[1].id
            });
            const { email, password } = adminData;

            await request
                .post('/api/auth/login')
                .send({ email, password })
                .expect(StatusCodes.OK);

            const { body: contractData } = await request
                .post('/api/contracts')
                .send(contractBeforeUpdateData);

            const userBefore = await userRepository.findByPk(users[1].id);
            const contract = await contractRepository.findByPk(contractData.id);

            const spyContractUpdate = await jest
                .spyOn(contract, 'update')
                .mockImplementation(() => {
                    throw new Error('UFO killed our DB');
                });

            const spyContractFind = await jest
                .spyOn(contractRepository, 'findByPk')
                .mockImplementation(() => contract);

            const { statusCode } = await request
                .put(`/api/contracts/${contract.id}`)
                .send(contractAfterUpdateData);

            const userAfter = await userRepository.findByPk(users[1].id);

            expect(statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(userBefore.vacationDaysTotal).toEqual(
                userAfter.vacationDaysTotal
            );

            spyContractUpdate.mockClear();
            spyContractFind.mockClear();
        });
    });
});
