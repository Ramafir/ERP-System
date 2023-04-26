const AbstractRepository = require('./AbstractRepository');
const deepmerge = require('deepmerge');
const { Op } = require('sequelize');

class ContractRepository extends AbstractRepository {
    get model() {
        const { Contract } = this.database;

        return Contract;
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

        const contract = await this.findById(id, args);

        if (!contract) {
            return null;
        }

        return contract;
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

module.exports = ContractRepository;
