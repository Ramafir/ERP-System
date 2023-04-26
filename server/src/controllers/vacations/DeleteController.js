class DeleteController {
    constructor(
        vacationRepository,
        userRepository,
        calculateVacationDaysOnUser,
        statusCodes
    ) {
        this.vacationRepository = vacationRepository;
        this.userRepository = userRepository;
        this.calculateVacationDaysOnUser = calculateVacationDaysOnUser;
        this.statusCodes = statusCodes;
    }

    async invoke(request, response) {
        const transaction = await this.vacationRepository.startTransaction();
        const { id } = request.params;

        try {
            const vacation = await this.vacationRepository.findByPk(id);
            const { isAdmin } = request.session;

            if (!vacation) {
                return response.sendStatus(this.statusCodes.NO_CONTENT);
            }

            const employee = await this.userRepository.findByPk(
                vacation.userId
            );

            await this.calculateVacationDaysOnUser.delete(
                employee,
                vacation,
                transaction
            );

            if (
                isAdmin ||
                (vacation.confirmed === false &&
                    vacation.userId === request.session.userId)
            ) {
                await vacation.destroy({ transaction });
            } else {
                return response.sendStatus(this.statusCodes.FORBIDDEN);
            }

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
