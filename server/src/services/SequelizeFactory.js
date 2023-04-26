const { Sequelize } = require('sequelize');
const { db } = require('../config');
const fs = require('fs');
const path = require('path');

class SequelizeFactory {
    static create() {
        const sequelize = new Sequelize(db.url, { ...db });

        const basename = path.basename(__filename);

        const database = {};

        fs.readdirSync(path.join(__dirname, '..', 'models'))
            .filter(
                file =>
                    file.indexOf('.') !== 0 &&
                    file !== basename &&
                    file.slice(-3) === '.js'
            )
            .forEach(file => {
                const fileName = file.split('.')[0];
                if (fileName === 'index') {
                    return;
                }

                database[fileName] = require(path.join(
                    __dirname,
                    '..',
                    'models',
                    file
                ))(sequelize);
            });

        Object.keys(database).forEach(modelName => {
            if (database[modelName].associate) {
                database[modelName].associate(database);
            }
        });

        database.sequelize = sequelize;

        return database;
    }
}

module.exports = SequelizeFactory;
