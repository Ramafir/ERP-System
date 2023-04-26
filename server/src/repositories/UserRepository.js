const AbstractRepository = require('./AbstractRepository');
const deepmerge = require('deepmerge');

class UserRepository extends AbstractRepository {
    get model() {
        const { User } = this.database;

        return User;
    }

    getByEmail(email, options = {}) {
        return this.model.findOne(
            deepmerge(options, {
                where: { email },
                attributes: ['id', 'email', 'password']
            })
        );
    }

    get(id) {
        return this.model.findOne({
            where: {
                id: id
            },
            include: {
                association: 'roles',
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                }
            }
        });
    }
}

module.exports = UserRepository;
