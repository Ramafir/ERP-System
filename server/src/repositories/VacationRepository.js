const AbstractRepository = require('./AbstractRepository');
const deepmerge = require('deepmerge');
const { Op } = require('sequelize');

class VacationRepository extends AbstractRepository {
    get model() {
        const { Vacation } = this.database;

        return Vacation;
    }

    async get(id, options = {}) {
        const args = deepmerge(options, {
            include: [
                {
                    association: 'user',
                    include: [{ association: 'roles' }]
                }
            ]
        });

        const vacation = await this.findById(id, args);

        if (!vacation) {
            return null;
        }

        return vacation;
    }

    findAllByUserInTimeInterval(id, userId, startDate, endDate) {
        const where = {
            userId,
            [Op.or]: {
                startDate: {
                    [Op.between]: [startDate, endDate]
                },
                endDate: {
                    [Op.between]: [startDate, endDate]
                },
                [Op.and]: {
                    startDate: {
                        [Op.lte]: startDate
                    },
                    endDate: {
                        [Op.gte]: endDate
                    }
                }
            }
        };

        if (id) {
            where.id = { [Op.ne]: id };
        }

        return this.findAll({ where });
    }

    findById(id, options = {}) {
        const where = { id };

        const args = deepmerge({ where }, options);

        return this.model.findOne(args);
    }
}

module.exports = VacationRepository;
