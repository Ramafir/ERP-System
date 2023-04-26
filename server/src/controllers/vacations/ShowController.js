class ShowController {
    constructor(vacationRepository, statusCodes) {
        this.vacationRepository = vacationRepository;
        this.statusCodes = statusCodes;
    }

    async invoke(request, response) {
        const { id } = request.params;

        const vacation = await this.vacationRepository.findByPk(id);

        if (!vacation) {
            return response.sendStatus(this.statusCodes.NOT_FOUND);
        }

        return response.send(vacation);
    }
}

module.exports = ShowController;
