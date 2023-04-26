const { StatusCodes } = require('http-status-codes');
const UserFactory = require('../../factories/user');
const VacationFactory = require('../../factories/vacation');

const vacationRepository = di.get('repositories.vacation');
const userRepository = di.get('repositories.user');

let adminData = null;
let users = [];

describe('Vacations', () => {
    beforeAll(async () => {
        adminData = UserFactory.generate();
        users.push(
            await UserFactory.create({
                vacationDaysTaken: 0,
                vacationDaysTotal: 20
            })
        );
        const admin = await UserFactory.create(adminData);

        await admin.addRole(adminRole);
    });
    afterEach(async () => {
        await request.post('/api/auth/logout').send();
    });

    describe('VacationController', () => {
        describe('PUT api/vacations', () => {
            test('should return 200 sending valid data AS ADMIN', async () => {
                const firstVacationData = VacationFactory.generate({
                    userId: users[0].dataValues.id,
                    startDate: '2022-05-09',
                    endDate: '2022-05-13'
                });

                const secondVacationData = VacationFactory.generate({
                    userId: users[0].dataValues.id,
                    startDate: '2022-05-16',
                    endDate: '2022-05-20'
                });

                const vacationUpdateData = VacationFactory.generate({
                    userId: users[0].dataValues.id,
                    startDate: '2022-05-16',
                    endDate: '2022-05-16'
                });

                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                await request.post('/api/vacations').send(firstVacationData);

                const { body: vacationToUpdate } = await request
                    .post('/api/vacations')
                    .send(secondVacationData);

                const { statusCode, body } = await request
                    .put(`/api/vacations/${vacationToUpdate.id}`)
                    .send({ id: vacationToUpdate.id, ...vacationUpdateData });

                const { vacationDaysTaken, vacationDaysTotal } =
                    await userRepository.findByPk(users[0].dataValues.id);

                delete body.user;

                expect(vacationDaysTaken).toEqual(6);
                expect(vacationDaysTotal).toEqual(20);
                expect(body).toEqual({
                    ...vacationUpdateData,
                    confirmed: true,
                    deletedAt: null,
                    duration: 1,
                    createdAt: expect.anything(),
                    updatedAt: expect.anything(),
                    endDate: expect.anything(),
                    id: expect.anything()
                });
                expect(statusCode).toEqual(StatusCodes.OK);
            });

            test('should return 500 WHEN vacation.update FAILED as ADMIN', async () => {
                const vacationBeforeUpdateData = VacationFactory.generate({
                    startDate: '2022-01-01',
                    endDate: '2022-01-02',
                    userId: users[0].id
                });
                const vacationAfterUpdateData = VacationFactory.generate({
                    startDate: '2022-01-01',
                    endDate: '2022-01-01',
                    userId: users[0].id
                });

                const { email, password } = adminData;

                await request
                    .post('/api/auth/login')
                    .send({ email, password })
                    .expect(StatusCodes.OK);

                const { body: vacationData } = await request
                    .post('/api/vacations')
                    .send(vacationBeforeUpdateData);

                const vacation = await vacationRepository.findByPk(
                    vacationData.id
                );

                const spyVacationUpdate = await jest
                    .spyOn(vacation, 'update')
                    .mockImplementation(() => {
                        throw new Error('UFO killed our DB');
                    });

                const spyVacationFind = await jest
                    .spyOn(vacationRepository, 'findByPk')
                    .mockImplementation(() => vacation);

                const { statusCode } = await request
                    .put(`/api/vacations/${vacation.id}`)
                    .send({ id: vacationData.id, ...vacationAfterUpdateData });

                expect(spyVacationUpdate).toHaveBeenCalled();
                expect(statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);

                spyVacationUpdate.mockClear();
                spyVacationFind.mockClear();
            });
        });
    });
});
