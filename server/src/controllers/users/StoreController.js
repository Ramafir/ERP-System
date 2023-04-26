const { Role } = require('../../models');

class StoreController {
    constructor(userRepository, roleRepository, statusCodes, cache) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.statusCodes = statusCodes;
        this.cache = cache;
    }

    async invoke(request, response) {
        const roleEmployee = await this.roleRepository.findOneByName(
            Role.EMPLOYEE
        );

        const user = await this.userRepository.create(request.body);
        await user.addRole(roleEmployee);

        const userCreated = await this.userRepository.findByPk(user.id);

        await this.cache.forgetByPattern('users:*');

        return response.status(this.statusCodes.CREATED).send(userCreated);
    }
}

module.exports = StoreController;
