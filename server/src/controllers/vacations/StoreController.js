class StoreController {
    constructor(
        vacationRepository,
        userRepository,
        workingDaysCalculator,
        calculateVacationDaysOnUser,
        dayjs,
        statusCodes
    ) {
        this.vacationRepository = vacationRepository;
        this.userRepository = userRepository;
        this.workingDaysCalculator = workingDaysCalculator;
        this.calculateVacationDaysOnUser = calculateVacationDaysOnUser;
        this.dayjs = dayjs;
        this.statusCodes = statusCodes;
    }

    async invoke(request, response) {
        const transaction = await this.vacationRepository.startTransaction();

        const { startDate, endDate } = request.body;

        const { isAdmin } = request.session;

        const userId = isAdmin ? request.body.userId : request.session.userId;

        const duration = this.workingDaysCalculator.getBusinessDatesCount(
            startDate,
            endDate
        );

        try {
            if (isAdmin) {
                const employee = await this.userRepository.findByPk(userId);

                await this.calculateVacationDaysOnUser.create(
                    employee,
                    duration,
                    transaction
                );
            }

            const vacation = await this.vacationRepository.create(
                { ...request.body, userId, duration, confirmed: isAdmin },
                { transaction }
            );

            await transaction.commit();

            const vacationCreated = await this.vacationRepository.get(
                vacation.id
            );

            return response
                .status(this.statusCodes.CREATED)
                .send(vacationCreated);
        } catch (err) {
            console.error(err);

            await transaction.rollback();

            return response.sendStatus(this.statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = StoreController;
