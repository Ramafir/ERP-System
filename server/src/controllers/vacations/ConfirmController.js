class ConfirmController {
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

        const { id } = request.params;

        try {
            const vacation = await this.vacationRepository.findByPk(id);

            if (!vacation) {
                return response.sendStatus(this.statusCodes.NOT_FOUND);
            }

            await vacation.update({ confirmed: true }, { transaction });

            const employee = await this.userRepository.findByPk(
                vacation.userId
            );

            const vacationDaysToDeduct =
                this.workingDaysCalculator.getBusinessDatesCount(
                    vacation.startDate,
                    vacation.endDate
                );

            await this.calculateVacationDaysOnUser.update(
                employee,
                vacation,
                vacationDaysToDeduct,
                transaction
            );

            await transaction.commit();

            const vacationUpdated = await this.vacationRepository.get(id);

            return response.send(vacationUpdated);
        } catch (err) {
            console.error(err);

            await transaction.rollback();

            return response.sendStatus(this.statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = ConfirmController;
