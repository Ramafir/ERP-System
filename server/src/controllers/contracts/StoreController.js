class StoreController {
    constructor(contractRepository, userRepository, dayjs, statusCodes) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.dayjs = dayjs;
        this.statusCodes = statusCodes;
    }

    async invoke(request, response) {
        const transaction = await this.contractRepository.startTransaction();

        const { vacationsPerYear, startDate, duration, userId } = request.body;

        const availableDaysOffAmount = Math.ceil(
            (vacationsPerYear / 12) * duration
        );

        const endDate = this.dayjs(startDate)
            .add(duration, 'M')
            .subtract(1, 'day')
            .format('YYYY-MM-DD');

        try {
            const user = await this.userRepository.findByPk(userId);

            const newContract = await this.contractRepository.create(
                {
                    ...request.body,
                    endDate,
                    availableDaysOffAmount
                },
                { transaction }
            );

            const newVacationDaysTotal =
                user.vacationDaysTotal + availableDaysOffAmount;

            await user.update(
                {
                    vacationDaysTotal: newVacationDaysTotal
                },
                { transaction }
            );

            await transaction.commit();

            const contractCreated = await this.contractRepository.get(
                newContract.id
            );

            return response
                .status(this.statusCodes.CREATED)
                .send(contractCreated);
        } catch (err) {
            console.error(err);

            await transaction.rollback();

            return response.sendStatus(this.statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = StoreController;
