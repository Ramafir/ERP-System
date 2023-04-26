const { Op } = require('sequelize');

class IndexController {
    constructor(vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    async invoke(request, response) {
        const { deleted, confirm, page, perPage } = request.query;
        const deletedAt = deleted === 'true' ? { [Op.not]: null } : null;
        const confirmed =
            confirm === 'false'
                ? { [Op.eq]: false }
                : { [Op.or]: [true, false] };
        const userId = request.session.userId;
        const isEmployee = !request.session.isAdmin;
        const where = {
            deletedAt,
            confirmed
        };

        if (isEmployee) {
            where.userId = userId;
        }

        const order =
            deleted === 'true'
                ? [['deletedAt', 'DESC']]
                : [['createdAt', 'DESC']];

        const offset = (page - 1) * perPage || 0;
        const limit = parseInt(perPage) || null;

        const vacations = await this.vacationRepository.findAndCountAll({
            where,
            include: {
                association: 'user',
                attributes: ['id', 'firstName', 'lastName', 'fullName'],
                where: {
                    deletedAt: { [Op.eq]: null }
                }
            },
            order,
            offset,
            limit,
            paranoid: false
        });

        return response.send(vacations);
    }
}

module.exports = IndexController;
