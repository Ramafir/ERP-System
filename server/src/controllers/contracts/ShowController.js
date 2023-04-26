class ShowController {
    constructor(contractRepository, statusCodes) {
        this.contractRepository = contractRepository;
        this.statusCodes = statusCodes;
    }

    async invoke(request, response) {
        const { id } = request.params;

        const contract = await this.contractRepository.findByPk(id);

        if (!contract) {
            return response.sendStatus(this.statusCodes.NOT_FOUND);
        }

        return response.send(contract);
    }
}

module.exports = ShowController;
