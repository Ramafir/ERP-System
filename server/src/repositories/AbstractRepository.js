class AbstractRepository {
    constructor(database) {
        this.database = database;
    }

    findAll(options = {}) {
        return this.model.findAll(options);
    }

    findAndCountAll(options = {}) {
        return this.model.findAndCountAll(options);
    }

    findOne(options = {}) {
        return this.model.findOne(options);
    }

    findByPk(id) {
        return this.model.findByPk(id);
    }

    create(data, options = {}) {
        return this.model.create(data, options);
    }

    update(data, options = {}) {
        return this.model.update(data, options);
    }

    delete(id) {
        this.model.destroy({
            where: {
                id
            }
        });
    }

    startTransaction() {
        return this.database.sequelize.transaction();
    }
}

module.exports = AbstractRepository;
