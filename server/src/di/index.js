const {
    ContainerBuilder,
    YamlFileLoader
} = require('node-dependency-injection');
const fs = require('fs');
const path = require('path');

const container = new ContainerBuilder(true);
const loader = new YamlFileLoader(container);

const loadFiles = (currentDirectory = '') => {
    const currentLocation = path.join(__dirname, currentDirectory);
    const allFiles = fs.readdirSync(currentLocation);
    const directories = allFiles.filter(file => !file.includes('.'));
    const files = allFiles.filter(file => file.includes('.'));

    for (const file of files) {
        const fileName = file.split('.')[0];

        if (fileName === 'index' && !currentDirectory) {
            continue;
        }

        loader.load(path.join(currentLocation, `${fileName}.yml`));
    }

    for (const directory of directories) {
        loadFiles(path.join(currentDirectory, directory));
    }
};

loadFiles();

module.exports = container;
