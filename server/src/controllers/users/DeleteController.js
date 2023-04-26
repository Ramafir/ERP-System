class DeleteController {
    constructor(userRepository, statusCodes, cache) {
        this.userRepository = userRepository;
        this.statusCodes = statusCodes;
        this.cache = cache;
    }

    async invoke(request, response) {
        const { id: userId } = request.params;

        const user = await this.userRepository.findByPk(userId);

        if (!user) {
            return response.sendStatus(this.statusCodes.NO_CONTENT);
        }

        await user.destroy();

        await this.cache.forgetByPattern('users:*');

        return response.sendStatus(this.statusCodes.NO_CONTENT);
    }
}

module.exports = DeleteController;
