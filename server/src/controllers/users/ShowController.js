class ShowController {
    constructor(userRepository, statusCodes) {
        this.userRepository = userRepository;
        this.statusCodes = statusCodes;
    }

    async invoke(request, response) {
        const {
            params: { id: userId }
        } = request;

        const user = await this.userRepository.findByPk(userId);

        if (!user) {
            return response.sendStatus(this.statusCodes.NOT_FOUND);
        }

        return response.send(user);
    }
}

module.exports = ShowController;
