const express = require('express');
const router = express.Router();
const fs = require('fs');

module.exports = di => {
    const files = fs.readdirSync(__dirname);

    for (const file of files) {
        const route = file.split('.')[0];

        if (route === 'index') {
            continue;
        }

        if (route === 'default') {
            router.use('/', require(`./${route}`)(di));
            continue;
        }

        router.use(`/${route}`, require(`./${route}`)(di));
    }

    return router;
};
