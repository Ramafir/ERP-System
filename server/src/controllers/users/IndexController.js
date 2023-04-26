const { Op } = require('sequelize');

class IndexController {
    constructor(userRepository, cache) {
        this.userRepository = userRepository;
        this.cache = cache;
    }

    async invoke(request, response) {
        const { deleted, query, page, perPage } = request.query;
        const deletedAt = deleted === 'true' ? { [Op.not]: null } : null;

        const order =
            deleted === 'true'
                ? [['deletedAt', 'DESC']]
                : [['createdAt', 'DESC']];

        const where = {};

        const cacheKey = `users:index:${page}:${perPage}:${query}`;

        if (await this.cache.exists(cacheKey)) {
            const users = await this.cache.get(cacheKey);

            return response.send(users);
        }

        if (query) {
            where[Op.or] = {
                firstName: {
                    [Op.like]: `%${query}%`
                },
                lastName: {
                    [Op.like]: `%${query}%`
                }
            };
        }

        where[Op.and] = {
            deletedAt
        };

        const offset = (page - 1) * perPage || 0;
        const limit = parseInt(perPage) || null;

        const users = await this.userRepository.findAndCountAll({
            where,
            order,
            offset,
            limit,
            paranoid: false
        });

        await this.cache.set(cacheKey, users);

        return response.send(users);
    }
}

module.exports = IndexController;
