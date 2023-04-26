class DeleteController {
    constructor(contractRepository, userRepository, statusCodes) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.statusCodes = statusCodes;
    }

    async invoke(request, response) {
        const transaction = await this.contractRepository.startTransaction();
        const { id } = request.params;

        try {
            const contract = await this.contractRepository.findByPk(id);

            if (!contract) {
                return response.sendStatus(this.statusCodes.NO_CONTENT);
            }

            const user = await this.userRepository.findByPk(contract.userId);

            const newVacationDaysTotal =
                user.vacationDaysTotal - contract.availableDaysOffAmount;

            await user.update(
                {
                    vacationDaysTotal: newVacationDaysTotal
                },
                { transaction }
            );

            await contract.destroy({ transaction });

            await transaction.commit();

            return response.sendStatus(this.statusCodes.NO_CONTENT);
        } catch (err) {
            console.error(err);

            await transaction.rollback();

            return response.sendStatus(this.statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = DeleteController;
