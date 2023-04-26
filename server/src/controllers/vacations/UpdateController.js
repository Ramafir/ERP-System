class UpdateController {
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

        const { startDate, endDate, userId } = request.body;

        const { id } = request.params;

        const duration = this.workingDaysCalculator.getBusinessDatesCount(
            startDate,
            endDate
        );

        try {
            const vacation = await this.vacationRepository.findByPk(id);

            if (!vacation) {
                return response.sendStatus(this.statusCodes.NOT_FOUND);
            }

            const { isAdmin } = request.session;

            if (isAdmin) {
                const employee = await this.userRepository.findByPk(userId);

                await this.calculateVacationDaysOnUser.update(
                    employee,
                    vacation,
                    duration,
                    transaction
                );
            }

            if (
                isAdmin ||
                (vacation.confirmed === false &&
                    vacation.userId === request.session.userId)
            ) {
                await vacation.update(
                    { ...request.body, duration, confirmed: isAdmin },
                    { transaction }
                );
            } else {
                return response.sendStatus(this.statusCodes.FORBIDDEN);
            }

            await transaction.commit();

            const vacationUpdated = await this.vacationRepository.get(
                vacation.id
            );

            return response.send(vacationUpdated);
        } catch (err) {
            console.error(err);

            await transaction.rollback();

            return response.sendStatus(this.statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UpdateController;
