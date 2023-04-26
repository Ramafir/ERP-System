const { Op } = require('sequelize');

class IndexController {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }

    async invoke(request, response) {
        const { deleted, page, perPage } = request.query;
        const deletedAt = deleted === 'true' ? { [Op.not]: null } : null;

        const order =
            deleted === 'true'
                ? [['deletedAt', 'DESC']]
                : [['createdAt', 'DESC']];

        const offset = (page - 1) * perPage || 0;
        const limit = parseInt(perPage) || null;

        const contracts = await this.contractRepository.findAndCountAll({
            where: {
                deletedAt
            },
            include: {
                association: 'user',
                attributes: ['firstName', 'lastName', 'fullName'],
                where: {
                    deletedAt: { [Op.eq]: null }
                }
            },
            order,
            offset,
            limit,
            paranoid: false
        });

        return response.send(contracts);
    }
}

module.exports = IndexController;
