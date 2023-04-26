class UpdateController {
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

        await user.update(request.body);

        const userUpdated = await this.userRepository.findByPk(user.id);

        await this.cache.forgetByPattern('users:*');

        return response.send(userUpdated);
    }
}

module.exports = UpdateController;
