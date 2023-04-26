class UpdateController {
    constructor(contractRepository, userRepository, dayjs, statusCodes) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.dayjs = dayjs;
        this.statusCodes = statusCodes;
    }

    async invoke(request, response) {
        const transaction = await this.contractRepository.startTransaction();

        const { vacationsPerYear, startDate, duration, userId } = request.body;

        const { id } = request.params;

        const availableDaysOffAmount = Math.ceil(
            Math.round(vacationsPerYear / 12) * duration
        );

        const endDate = this.dayjs(startDate)
            .add(duration, 'M')
            .subtract(1, 'day')
            .format('YYYY-MM-DD');

        try {
            const contract = await this.contractRepository.findByPk(id);

            if (!contract) {
                return response.sendStatus(this.statusCodes.NOT_FOUND);
            }

            const employee = await this.userRepository.findByPk(userId);

            const oldVacationDaysTotal =
                employee.vacationDaysTotal - contract.availableDaysOffAmount;

            const newVacationDaysTotal =
                oldVacationDaysTotal + availableDaysOffAmount;

            await contract.update(
                { ...request.body, endDate, availableDaysOffAmount },
                { transaction }
            );

            await employee.update(
                {
                    vacationDaysTotal: newVacationDaysTotal
                },
                { transaction }
            );

            await transaction.commit();

            const contractUpdated = await this.contractRepository.get(
                contract.id
            );

            return response.send(contractUpdated);
        } catch (err) {
            console.error(err);

            await transaction.rollback();

            return response.sendStatus(this.statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UpdateController;
