const AbstractRepository = require('./AbstractRepository');

class RoleRepository extends AbstractRepository {
    get model() {
        const { Role } = this.database;

        return Role;
    }

    findOneByName(roleName) {
        return this.model.findOne({
            where: { name: roleName }
        });
    }
}

module.exports = RoleRepository;
